'use client';

import { SHIPPING_METHODS } from '@/modules/_shared/constants/shipping-methods.constants';
import { formatEgpSimple } from '@/modules/_shared/utils/format-egp';
import { cn } from '@/modules/_shared/utils/cn';
import { checkoutTokens } from '../checkout.tokens';

interface ShippingMethodSelectorProps {
  selected: 'STANDARD' | 'EXPRESS';
  onChange: (method: 'STANDARD' | 'EXPRESS') => void;
}

export function ShippingMethodSelector({ selected, onChange }: ShippingMethodSelectorProps) {
  const t = checkoutTokens.shippingMethod;
  return (
    <div className={t.root} role="radiogroup" aria-label="Shipping method">
      {(Object.values(SHIPPING_METHODS) as typeof SHIPPING_METHODS[keyof typeof SHIPPING_METHODS][]).map((method) => {
        const isSelected = selected === method.id;
        return (
          <label
            key={method.id}
            className={cn(t.option, isSelected ? t.optionSelected : t.optionDefault)}
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
              <p className={t.label}>{method.label}</p>
              <p className={t.days}>{method.days}</p>
            </div>
            <p className={t.cost}>
              {formatEgpSimple(method.costEgp)}
            </p>
          </label>
        );
      })}
    </div>
  );
}
