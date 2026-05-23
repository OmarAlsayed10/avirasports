import { cn } from '@/modules/_shared/utils/cn';
import { priceDisplayTokens as tk } from './price-display.tokens';
import type { PriceDisplayProps } from './price-display.types';

export function PriceDisplay({ priceEgp, discountPercent, className, size = 'base' }: PriceDisplayProps) {
  const discounted = discountPercent
    ? priceEgp - (priceEgp * discountPercent) / 100
    : null;

  const saleClass = size === 'lg' ? tk.saleLg : tk.saleMd;

  return (
    <div className={cn(tk.wrapper, className)}>
      {discounted !== null && (
        <span
          className={cn(saleClass, tk.saleLabel)}
          aria-label={`Sale price: EGP ${discounted.toLocaleString()}`}
        >
          EGP {discounted.toLocaleString('en-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
        </span>
      )}
      <span
        className={cn(
          size === 'sm' ? tk.originalSm : tk.originalLg,
          tk.originalLabel,
          discounted !== null ? tk.originalStrike : tk.originalNormal
        )}
        aria-label={discounted !== null ? `Original price: EGP ${priceEgp.toLocaleString()}` : `Price: EGP ${priceEgp.toLocaleString()}`}
      >
        EGP {priceEgp.toLocaleString('en-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
      </span>
    </div>
  );
}

export default PriceDisplay;
