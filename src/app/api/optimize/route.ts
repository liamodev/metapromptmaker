import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateClarifiers } from '@/lib/providers/openai';
import { getPackByKey } from '@/lib/packs';
import { buildClarifierPrompt } from '@/lib/metaPrompts';
import { prisma } from '@/lib/db';
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit';

const OptimizeSchema = z.object({
  rawPrompt: z.string().min(1, 'Prompt is required'),
  packKey: z.string().optional(),
  sessionId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResult = await rateLimit(RATE_LIMITS.optimize);
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
    const { rawPrompt, packKey, sessionId } = OptimizeSchema.parse(body);

    // Get use case pack if specified
    const pack = packKey ? getPackByKey(packKey) : undefined;
    
    // Build the clarifier generation prompt
    const clarifierPrompt = buildClarifierPrompt(rawPrompt, pack);
    
    // Generate clarifiers using OpenAI
    const clarifierData = await generateClarifiers(clarifierPrompt);
    
    // Log event
    if (sessionId) {
      await prisma.event.create({
        data: {
          sessionId,
          kind: 'optimize_click',
          data: {
            packKey,
            promptLength: rawPrompt.length,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      clarifiers: clarifierData.questions,
    });
  } catch (error) {
    console.error('Optimize API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to generate clarifiers' },
      { status: 500 }
    );
  }
}
