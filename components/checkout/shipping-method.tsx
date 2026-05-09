'use client';

import { SHIPPING_METHODS } from '@/lib/constants/shipping-methods';
import { formatEgpSimple } from '@/lib/utils/format-egp';
import { cn } from '@/lib/utils/cn';

interface ShippingMethodSelectorProps {
  selected: 'STANDARD' | 'EXPRESS';
  onChange: (method: 'STANDARD' | 'EXPRESS') => void;
}

export function ShippingMethodSelector({ selected, onChange }: ShippingMethodSelectorProps) {
  return (
    <div className="space-y-3" role="radiogroup" aria-label="Shipping method">
      {(Object.values(SHIPPING_METHODS) as typeof SHIPPING_METHODS[keyof typeof SHIPPING_METHODS][]).map((method) => {
        const isSelected = selected === method.id;
        return (
          <label
            key={method.id}
            className={cn(
              'flex items-center gap-4 p-4 rounded-carousel border-2 cursor-pointer transition-colors',
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-border-primary/20 hover:border-primary/50'
            )}
          >
            <input
              type="radio"
              name="shippingMethod"
              value={method.id}
              checked={isSelected}
              onChange={() => onChange(method.id)}
              className="accent-primary"
            />
            <div className="flex-1">
              <p className="text-nav-sm font-semibold text-text-primary">{method.label}</p>
              <p className="text-xs text-text-secondary">{method.days}</p>
            </div>
            <p className="text-nav-sm font-semibold text-text-primary">
              {formatEgpSimple(method.costEgp)}
            </p>
          </label>
        );
      })}
    </div>
  );
}
