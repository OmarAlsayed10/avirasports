'use client';

import { useLocale } from '@/lib/i18n/context';

interface ResultsCountProps {
  shown: number;
  total: number;
}

export function ResultsCount({ shown, total }: ResultsCountProps) {
  const { t } = useLocale();
  if (total === 0) return null;
  return (
    <p className="text-nav-sm text-text-secondary dark:text-text-footer-link">
      {t.shop.showing(shown, total)}
    </p>
  );
}
