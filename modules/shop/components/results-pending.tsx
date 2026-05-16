'use client';

import { useQueryParams } from '@/modules/_shared/hooks/use-query-params';
import { shopTokens } from '../shop.tokens';

export function ResultsPending() {
  const { isPending } = useQueryParams();
  if (!isPending) return null;
  return (
    <div
      className={shopTokens.resultsPending.overlay}
      aria-hidden="true"
    />
  );
}
