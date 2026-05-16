'use client';

import { Minus, Plus } from 'lucide-react';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { productTokens } from '../product.tokens';

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
      className={productTokens.quantitySelector.root}
      role="group"
      aria-label={t.product.quantity}
    >
      <button
        onClick={decrement}
        disabled={quantity <= min}
        aria-label={t.product.decrease}
        className={productTokens.quantitySelector.btn}
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
        className={productTokens.quantitySelector.input}
        aria-label={t.product.quantityValue}
      />
      <button
        onClick={increment}
        disabled={quantity >= max}
        aria-label={t.product.increase}
        className={productTokens.quantitySelector.btn}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
