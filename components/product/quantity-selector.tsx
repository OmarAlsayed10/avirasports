'use client';

import { Minus, Plus } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({ quantity, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  const { t } = useLocale();
  const decrement = () => onChange(Math.max(min, quantity - 1));
  const increment = () => onChange(Math.min(max, quantity + 1));

  return (
    <div
      className="flex items-center border border-border-primary/40 dark:border-white/20 rounded-stepper overflow-hidden w-fit"
      role="group"
      aria-label={t.product.quantity}
    >
      <button
        onClick={decrement}
        disabled={quantity <= min}
        aria-label={t.product.decrease}
        className="flex items-center justify-center w-10 h-10 text-text-primary dark:text-text-on-dark hover:bg-bg-page dark:hover:bg-bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="number"
        value={quantity}
        min={min}
        max={max}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val)) onChange(Math.min(max, Math.max(min, val)));
        }}
        className="w-12 text-center text-nav-sm font-semibold text-text-primary dark:text-text-on-dark bg-transparent border-x border-border-primary/40 dark:border-white/20 focus:outline-none"
        aria-label={t.product.quantityValue}
      />
      <button
        onClick={increment}
        disabled={quantity >= max}
        aria-label={t.product.increase}
        className="flex items-center justify-center w-10 h-10 text-text-primary dark:text-text-on-dark hover:bg-bg-page dark:hover:bg-bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
