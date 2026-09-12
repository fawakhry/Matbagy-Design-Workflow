export class MemoryRateLimiter {
  constructor({ limit = 20, windowMs = 60000, now = () => Date.now() } = {}) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.now = now;
    this.buckets = new Map();
  }
  consume(key) {
    const at = this.now();
    const current = this.buckets.get(key);
    if (!current || at >= current.resetAt) {
      const next = { count: 1, resetAt: at + this.windowMs };
      this.buckets.set(key, next);
      return { allowed: true, remaining: this.limit - 1, resetAt: next.resetAt };
    }
    if (current.count >= this.limit) return { allowed: false, remaining: 0, resetAt: current.resetAt };
    current.count += 1;
    return { allowed: true, remaining: this.limit - current.count, resetAt: current.resetAt };
  }
}
