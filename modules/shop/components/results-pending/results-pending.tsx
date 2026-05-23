'use client';

import { useQueryParams } from '@/modules/_shared/hooks/use-query-params';
import { resultsPendingTokens } from './results-pending.tokens';

export function ResultsPending() {
  const { isPending } = useQueryParams();
  if (!isPending) return null;
  return (
    <div
      className={resultsPendingTokens.overlay}
      aria-hidden="true"
    />
  );
}
