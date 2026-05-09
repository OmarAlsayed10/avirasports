'use client';

import { useQueryParams } from '@/lib/hooks/use-query-params';

export function ResultsPending() {
  const { isPending } = useQueryParams();
  if (!isPending) return null;
  return (
    <div
      className="absolute inset-0 bg-bg-page/60 rounded z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
