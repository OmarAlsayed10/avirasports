export const RATE_LIMITS = {
  auth: { requests: 5, window: '15m' },
  newsletter: { requests: 3, window: '1h' },
  checkout: { requests: 10, window: '1m' },
  upload: { requests: 20, window: '1h' },
  feedback: { requests: 3, window: '1h' },
} as const;
