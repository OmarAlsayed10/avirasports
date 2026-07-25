'use client';

import { useEffect } from 'react';
import { trackPixelEvent } from '@/modules/_shared/analytics/meta-pixel-events';

export function ProductViewTracker({
  id,
  name,
  category,
  price,
}: {
  id: string;
  name: string;
  category?: string;
  price: number;
}) {
  useEffect(() => {
    trackPixelEvent.viewContent({
      content_id: id,
      content_name: name,
      content_category: category,
      price,
    });
  }, [id, name, category, price]);

  return null;
}
