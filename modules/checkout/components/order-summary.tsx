'use client';

import Image from 'next/image';
import { formatEgpSimple } from '@/modules/_shared/utils/format-egp';
import { SHIPPING_METHODS } from '@/modules/_shared/constants/shipping-methods.constants';
import { CouponInput } from './coupon-input';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { checkoutTokens } from '../checkout.tokens';
import type { CartItem } from '@/modules/cart/cart.store';

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
    <div className={checkoutTokens.orderSummary.root}>
      <h2 className={checkoutTokens.orderSummary.title}>{t.checkout.orderSummary}</h2>

      <div className={checkoutTokens.orderSummary.itemsList}>
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId ?? ''}`} className={checkoutTokens.orderSummary.itemRow}>
            <div className={checkoutTokens.orderSummary.itemImageWrapper}>
              <Image
                src={item.imageUrl || '/placeholder-product.jpg'}
                alt={item.name}
                fill
                className="object-contain p-1"
                sizes="48px"
              />
              <span className={checkoutTokens.orderSummary.itemQtyBadge}>
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={checkoutTokens.orderSummary.itemName}>
                {isAr && item.nameAr ? item.nameAr : item.name}
              </p>
            </div>
            <p className={checkoutTokens.orderSummary.itemPrice}>
              {formatEgpSimple(item.unitPriceEgp * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <hr className={checkoutTokens.orderSummary.divider} />

      <div>
        <p className={checkoutTokens.orderSummary.couponLabel}>{t.checkout.discountCode}</p>
        <CouponInput
          subtotalEgp={subtotal}
          onApplied={onCouponApplied}
          appliedCode={appliedCoupon}
        />
      </div>

      <hr className={checkoutTokens.orderSummary.divider} />

      <div className="space-y-2">
        <div className={checkoutTokens.orderSummary.totalsRow}>
          <span className={checkoutTokens.orderSummary.totalsLabel}>{t.checkout.subtotal}</span>
          <span>{formatEgpSimple(subtotal)}</span>
        </div>
        <div className={checkoutTokens.orderSummary.totalsRow}>
          <span className={checkoutTokens.orderSummary.totalsLabel}>{t.checkout.shipping}</span>
          <span>{formatEgpSimple(shipping)}</span>
        </div>
        {discountEgp > 0 && (
          <div className={checkoutTokens.orderSummary.discountRow}>
            <span>{t.checkout.discount}</span>
            <span>- {formatEgpSimple(discountEgp)}</span>
          </div>
        )}
        <hr className={checkoutTokens.orderSummary.divider} />
        <div className={checkoutTokens.orderSummary.totalRow}>
          <span>{t.checkout.total}</span>
          <span>{formatEgpSimple(total)}</span>
        </div>
      </div>
    </div>
  );
}
