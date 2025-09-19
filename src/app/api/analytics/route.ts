import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';
import crypto from 'crypto';

const AnalyticsSchema = z.object({
  sessionId: z.string(),
  kind: z.string(),
  data: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Analytics request body:', body);
    
    // Validate the request body
    if (!body.sessionId || !body.kind) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const { sessionId, kind, data } = body;

    // Get IP for hashing (optional)
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : headersList.get('x-real-ip') || 'unknown';
    
    // Hash IP with salt for privacy
    const salt = process.env.RATE_LIMIT_SALT || 'default-salt';
    const ipHash = crypto.createHash('sha256').update(ip + salt).digest('hex');

    // Get user agent
    const userAgent = headersList.get('user-agent') || undefined;

    // Ensure session exists
    await prisma.session.upsert({
      where: { id: sessionId },
      update: {},
      create: {
        id: sessionId,
        ipHash,
        userAgent,
      },
    });

    // Create event
    await prisma.event.create({
      data: {
        sessionId,
        kind,
        data,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to log analytics' },
      { status: 500 }
    );
  }
}
