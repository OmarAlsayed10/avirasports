import { cn } from '@/lib/utils/cn';

type PriceDisplayProps = {
  priceEgp: number;
  discountPercent?: number | null;
  className?: string;
  size?: 'sm' | 'base' | 'lg';
};

export function PriceDisplay({ priceEgp, discountPercent, className, size = 'base' }: PriceDisplayProps) {
  const discounted = discountPercent
    ? priceEgp - (priceEgp * discountPercent) / 100
    : null;

  const saleClass =
    size === 'sm'
      ? 'text-card'
      : size === 'lg'
        ? 'text-category-label'
        : 'text-card';

  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      {discounted !== null && (
        <span
          className={cn(saleClass, 'font-light text-sale tracking-price')}
          aria-label={`Sale price: EGP ${discounted.toLocaleString()}`}
        >
          EGP {discounted.toLocaleString('en-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
        </span>
      )}
      <span
        className={cn(
          size === 'sm' ? 'text-md' : 'text-card',
          'font-extralight',
          discounted !== null ? 'text-text-secondary line-through tracking-strike' : 'text-text-primary tracking-price'
        )}
        aria-label={discounted !== null ? `Original price: EGP ${priceEgp.toLocaleString()}` : `Price: EGP ${priceEgp.toLocaleString()}`}
      >
        EGP {priceEgp.toLocaleString('en-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
      </span>
    </div>
  );
}

export default PriceDisplay;
