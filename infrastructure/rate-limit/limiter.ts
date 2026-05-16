type RateWindow = { hits: number[] };

const store = new Map<string, RateWindow>();

setInterval(() => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  store.forEach((win, key) => {
    win.hits = win.hits.filter((t) => t > cutoff);
    if (win.hits.length === 0) store.delete(key);
  });
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  let win: RateWindow | undefined = store.get(key);
  if (!win) {
    win = { hits: [] };
    store.set(key, win);
  }

  win.hits = win.hits.filter((t) => t > cutoff);

  const remaining = Math.max(0, limit - win.hits.length - 1);

  if (win.hits.length >= limit) {
    const oldestInWindow = win.hits[0];
    const resetInMs = oldestInWindow + windowMs - now;
    return { allowed: false, remaining: 0, resetInMs };
  }

  win.hits.push(now);
  return { allowed: true, remaining, resetInMs: windowMs };
}

export function getClientIp(request: Request): string {
  const headers = [
    'x-forwarded-for',
    'cf-connecting-ip',
    'x-real-ip',
  ];
  for (const h of headers) {
    const val = (request as Request & { headers: Headers }).headers.get(h);
    if (val) return val.split(',')[0].trim();
  }
  return 'unknown';
}
