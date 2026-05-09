'use client';

import { CreditCard, Store } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type PaymentMethod = 'CARD' | 'PAY_AT_FAWRY';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

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
  return (
    <div className="space-y-3" role="radiogroup" aria-label="Payment method">
      {OPTIONS.map(({ id, label, description, icon: Icon }) => {
        const isSelected = selected === id;
        return (
          <label
            key={id}
            className={cn(
              'flex items-start gap-4 p-4 rounded-carousel border-2 cursor-pointer transition-colors',
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-border-primary/20 hover:border-primary/50'
            )}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={id}
              checked={isSelected}
              onChange={() => onChange(id)}
              className="accent-primary mt-0.5"
            />
            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', isSelected ? 'text-primary' : 'text-text-secondary')} />
            <div>
              <p className="text-nav-sm font-semibold text-text-primary">{label}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
