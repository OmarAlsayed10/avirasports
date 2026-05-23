'use client';

import { Minus, Plus } from 'lucide-react';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { quantitySelectorTokens } from './quantity-selector.tokens';
import type { QuantitySelectorProps } from './quantity-selector.types';

export function QuantitySelector({ quantity, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  const { t } = useLocale();
  const decrement = () => onChange(Math.max(min, quantity - 1));
  const increment = () => onChange(Math.min(max, quantity + 1));

  return (
    <div
      className={quantitySelectorTokens.root}
      role="group"
      aria-label={t.product.quantity}
    >
      <button
        onClick={decrement}
        disabled={quantity <= min}
        aria-label={t.product.decrease}
        className={quantitySelectorTokens.btn}
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
        className={quantitySelectorTokens.input}
        aria-label={t.product.quantityValue}
      />
      <button
        onClick={increment}
        disabled={quantity >= max}
        aria-label={t.product.increase}
        className={quantitySelectorTokens.btn}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
