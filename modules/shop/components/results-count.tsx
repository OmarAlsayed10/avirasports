'use client';

import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { shopTokens } from '../shop.tokens';

interface ResultsCountProps {
  shown: number;
  total: number;
}

export function ResultsCount({ shown, total }: ResultsCountProps) {
  const { t } = useLocale();
  if (total === 0) return null;
  return (
    <p className={shopTokens.resultsCount.text}>
      {t.shop.showing(shown, total)}
    </p>
  );
}
