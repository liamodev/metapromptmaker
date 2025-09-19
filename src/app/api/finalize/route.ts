import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { callOpenAI } from '@/lib/providers/openai';
import { buildOptimizationPrompt } from '@/lib/metaPrompts';
import { prisma } from '@/lib/db';

const FinalizeSchema = z.object({
  rawPrompt: z.string().min(1, 'Raw prompt is required'),
  packKey: z.string().optional(),
  clarifiers: z.array(z.any()),
  clarifierAnswers: z.record(z.any()),
  sessionId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawPrompt, packKey, clarifiers, clarifierAnswers, sessionId } = FinalizeSchema.parse(body);

    // Build the optimization prompt
    const optimizationPrompt = buildOptimizationPrompt(rawPrompt, clarifierAnswers, packKey);
    
    // Generate optimized prompt using OpenAI
    const optimizedPrompt = await callOpenAI(optimizationPrompt);
    
    // Store the prompt record
    const promptRecord = await prisma.promptRecord.create({
      data: {
        sessionId,
        rawPrompt,
        packKey,
        clarifiers,
        clarifierAnswers,
        optimizedPrompt,
      },
    });

    // Log event
    if (sessionId) {
      await prisma.event.create({
        data: {
          sessionId,
          kind: 'finalize_click',
          data: {
            promptRecordId: promptRecord.id,
            packKey,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      optimizedPrompt,
      promptRecordId: promptRecord.id,
    });
  } catch (error) {
    console.error('Finalize API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to generate optimized prompt' },
      { status: 500 }
    );
  }
}
