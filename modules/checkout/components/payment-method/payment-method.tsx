'use client';

import { CreditCard, Store } from 'lucide-react';
import { cn } from '@/modules/_shared/utils/cn';
import { paymentMethodTokens } from './payment-method.tokens';
import type { PaymentMethodSelectorProps, PaymentMethod } from './payment-method.types';

const OPTIONS: { id: PaymentMethod; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    id: 'CARD',
    label: 'Pay by Card',
    description: 'Pay securely online with your credit or debit card via Fawry.',
    icon: CreditCard,
  },
  {
    id: 'PAY_AT_FAWRY',
    label: 'Pay at Fawry',
    description: 'Get a reference number and pay at any Fawry kiosk, bank app, or Fawry app within 48 hours.',
    icon: Store,
  },
];

export function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  const t = paymentMethodTokens;
  return (
    <div className={t.root} role="radiogroup" aria-label="Payment method">
      {OPTIONS.map(({ id, label, description, icon: Icon }) => {
        const isSelected = selected === id;
        return (
          <label
            key={id}
            className={cn(t.option, isSelected ? t.optionSelected : t.optionDefault)}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={id}
              checked={isSelected}
              onChange={() => onChange(id)}
              className="accent-primary mt-0.5"
            />
            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', isSelected ? t.iconSelected : t.iconDefault)} />
            <div>
              <p className={t.label}>{label}</p>
              <p className={t.desc}>{description}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
