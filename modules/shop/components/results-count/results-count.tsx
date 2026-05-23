'use client';

import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { resultsCountTokens } from './results-count.tokens';
import type { ResultsCountProps } from './results-count.types';

export function ResultsCount({ shown, total }: ResultsCountProps) {
  const { t } = useLocale();
  if (total === 0) return null;
  return (
    <p className={resultsCountTokens.text}>
      {t.shop.showing(shown, total)}
    </p>
  );
}
