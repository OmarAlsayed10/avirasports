'use client';

import Image from 'next/image';
import { formatEgpSimple } from '@/lib/utils/format-egp';
import { SHIPPING_METHODS } from '@/lib/constants/shipping-methods';
import { CouponInput } from './coupon-input';
import { useLocale } from '@/lib/i18n/context';
import type { CartItem } from '@/lib/stores/cart-store';

interface OrderSummaryProps {
  items: CartItem[];
  discountEgp: number;
  appliedCoupon: string | null;
  onCouponApplied: (discount: { discountEgp: number; code: string }) => void;
}

export function OrderSummary({
  items,
  discountEgp,
  appliedCoupon,
  onCouponApplied,
}: OrderSummaryProps) {
  const { t } = useLocale();
  const isAr = t.dir === 'rtl';
  const subtotal = items.reduce((sum, i) => sum + i.unitPriceEgp * i.quantity, 0);
  const shipping = SHIPPING_METHODS.STANDARD.costEgp;
  const total = Math.max(0, subtotal + shipping - discountEgp);

  return (
    <div className="bg-bg-dark rounded-carousel p-6 text-text-on-dark space-y-5">
      <h2 className="text-newsletter-sub font-semibold">{t.checkout.orderSummary}</h2>

      {/* Items */}
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId ?? ''}`} className="flex gap-3">
            <div className="relative w-12 h-12 flex-shrink-0 bg-bg-page/10 rounded-tag overflow-hidden">
              <Image
                src={item.imageUrl || '/placeholder-product.jpg'}
                alt={item.name}
                fill
                className="object-contain p-1"
                sizes="48px"
              />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-text-primary text-bg-white text-xs rounded-full flex items-center justify-center font-semibold">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium line-clamp-2 leading-tight">
                {isAr && item.nameAr ? item.nameAr : item.name}
              </p>
            </div>
            <p className="text-xs font-semibold whitespace-nowrap">
              {formatEgpSimple(item.unitPriceEgp * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <hr className="border-text-on-dark/20" />

      {/* Coupon */}
      <div>
        <p className="text-xs text-text-footer-link mb-2">{t.checkout.discountCode}</p>
        <CouponInput
          subtotalEgp={subtotal}
          onApplied={onCouponApplied}
          appliedCode={appliedCoupon}
        />
      </div>

      <hr className="border-text-on-dark/20" />

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between text-nav-sm">
          <span className="text-text-footer-link">{t.checkout.subtotal}</span>
          <span>{formatEgpSimple(subtotal)}</span>
        </div>
        <div className="flex justify-between text-nav-sm">
          <span className="text-text-footer-link">{t.checkout.shipping}</span>
          <span>{formatEgpSimple(shipping)}</span>
        </div>
        {discountEgp > 0 && (
          <div className="flex justify-between text-nav-sm text-success">
            <span>{t.checkout.discount}</span>
            <span>- {formatEgpSimple(discountEgp)}</span>
          </div>
        )}
        <hr className="border-text-on-dark/20" />
        <div className="flex justify-between text-newsletter-sub font-semibold">
          <span>{t.checkout.total}</span>
          <span>{formatEgpSimple(total)}</span>
        </div>
      </div>
    </div>
  );
}
