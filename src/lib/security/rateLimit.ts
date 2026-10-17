interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Clean up expired items periodically
setInterval(() => {
  const now = Date.now();
  memoryStore.forEach((record, key) => {
    if (record.resetAt <= now) {
      memoryStore.delete(key);
    }
  });
}, 60 * 1000);

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const existing = memoryStore.get(key);

  if (!existing || existing.resetAt <= now) {
    memoryStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetInMs: windowMs,
    };
  }

  if (existing.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetInMs: Math.max(0, existing.resetAt - now),
    };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: maxRequests - existing.count,
    resetInMs: Math.max(0, existing.resetAt - now),
  };
}
