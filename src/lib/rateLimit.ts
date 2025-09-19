import { headers } from 'next/headers';
import crypto from 'crypto';

// Simple in-memory rate limiter for development
// In production, you'd use Redis or similar
const requests = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  error?: string;
}

export async function rateLimit(config: RateLimitConfig): Promise<RateLimitResult> {
  const { windowMs, maxRequests } = config;
  
  // Get client IP
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : headersList.get('x-real-ip') || 'unknown';
  
  // Hash IP for privacy
  const salt = process.env.RATE_LIMIT_SALT || 'default-salt';
  const hashedIp = crypto.createHash('sha256').update(ip + salt).digest('hex');
  
  const now = Date.now();
  const resetTime = now + windowMs;
  
  // Clean up expired entries
  for (const [key, value] of requests.entries()) {
    if (now > value.resetTime) {
      requests.delete(key);
    }
  }
  
  // Get current request data
  const current = requests.get(hashedIp);
  
  if (!current || now > current.resetTime) {
    // First request or window expired
    requests.set(hashedIp, { count: 1, resetTime });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime,
    };
  }
  
  if (current.count >= maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetTime: current.resetTime,
      error: 'Rate limit exceeded',
    };
  }
  
  // Increment count
  current.count++;
  requests.set(hashedIp, current);
  
  return {
    success: true,
    remaining: maxRequests - current.count,
    resetTime: current.resetTime,
  };
}

// Predefined rate limit configs
export const RATE_LIMITS = {
  // General API requests
  api: { windowMs: 60 * 60 * 1000, maxRequests: 60 }, // 60 requests per hour
  
  // Expensive AI operations
  optimize: { windowMs: 60 * 60 * 1000, maxRequests: 20 }, // 20 optimizations per hour
  run: { windowMs: 60 * 60 * 1000, maxRequests: 10 }, // 10 model runs per hour
};
