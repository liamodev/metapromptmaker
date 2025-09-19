import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { callOpenAI } from '@/lib/providers/openai';
import { callAnthropic } from '@/lib/providers/anthropic';
import { callGoogle } from '@/lib/providers/google';
import { prisma } from '@/lib/db';
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit';

const RunSchema = z.object({
  optimizedPrompt: z.string().min(1, 'Optimized prompt is required'),
  promptRecordId: z.string(),
  models: z.object({
    openai: z.boolean().optional(),
    anthropic: z.boolean().optional(),
    google: z.boolean().optional(),
  }),
  sessionId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResult = await rateLimit(RATE_LIMITS.run);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: rateLimitResult.error },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          }
        }
      );
    }

    const body = await request.json();
    const { optimizedPrompt, promptRecordId, models, sessionId } = RunSchema.parse(body);

    const startTime = Date.now();
    const results: Record<string, string | null> = {};
    const timings: Record<string, number> = {};
    const errors: Record<string, string> = {};

    // Create array of promises for parallel execution
    const promises: Promise<void>[] = [];

    if (models.openai) {
      promises.push(
        (async () => {
          const modelStart = Date.now();
          try {
            results.openai = await callOpenAI(optimizedPrompt);
            timings.openai = Date.now() - modelStart;
          } catch (error) {
            console.error('OpenAI error:', error);
            errors.openai = error instanceof Error ? error.message : 'Unknown error';
            results.openai = null;
            timings.openai = Date.now() - modelStart;
          }
        })()
      );
    }

    if (models.anthropic) {
      promises.push(
        (async () => {
          const modelStart = Date.now();
          try {
            results.anthropic = await callAnthropic(optimizedPrompt);
            timings.anthropic = Date.now() - modelStart;
          } catch (error) {
            console.error('Anthropic error:', error);
            errors.anthropic = error instanceof Error ? error.message : 'Unknown error';
            results.anthropic = null;
            timings.anthropic = Date.now() - modelStart;
          }
        })()
      );
    }

    if (models.google) {
      promises.push(
        (async () => {
          const modelStart = Date.now();
          try {
            results.google = await callGoogle(optimizedPrompt);
            timings.google = Date.now() - modelStart;
          } catch (error) {
            console.error('Google error:', error);
            errors.google = error instanceof Error ? error.message : 'Unknown error';
            results.google = null;
            timings.google = Date.now() - modelStart;
          }
        })()
      );
    }

    // Wait for all promises to complete
    await Promise.allSettled(promises);

    const totalTime = Date.now() - startTime;

    // Update the prompt record with results
    await prisma.promptRecord.update({
      where: { id: promptRecordId },
      data: {
        ranOpenAI: !!models.openai,
        ranAnthropic: !!models.anthropic,
        ranGoogle: !!models.google,
        resultOpenAI: results.openai,
        resultAnthropic: results.anthropic,
        resultGoogle: results.google,
        metrics: {
          timings,
          totalTime,
          errors: Object.keys(errors).length > 0 ? errors : undefined,
        },
      },
    });

    // Log event
    if (sessionId) {
      await prisma.event.create({
        data: {
          sessionId,
          kind: 'run_models',
          data: {
            promptRecordId,
            models: Object.keys(models).filter(key => models[key as keyof typeof models]),
            timings,
            totalTime,
            hasErrors: Object.keys(errors).length > 0,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      results,
      timings,
      totalTime,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Run API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to run models' },
      { status: 500 }
    );
  }
}
