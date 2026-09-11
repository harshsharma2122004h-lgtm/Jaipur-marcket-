// Basic in-memory rate limiter for auth endpoints (brute-force protection).
//
// LIMITATION: this resets whenever the serverless function cold-starts,
// and does not share state across multiple instances. It is fine for a
// single-instance / early-stage deployment. Before real traffic, swap
// this for Upstash Redis (free tier, works great with Vercel) — the
// function signature below is designed so that swap only touches this
// file.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count };
}
