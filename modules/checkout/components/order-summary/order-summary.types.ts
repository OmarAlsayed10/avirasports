import type { CartItem } from '@/modules/cart/cart.store';

export interface OrderSummaryProps {
  items: CartItem[];
  discountEgp: number;
  appliedCoupon: string | null;
  onCouponApplied: (discount: { discountEgp: number; code: string }) => void;
  /** Shipping fee for the chosen governorate, or null before one is selected. */
  shippingEgp: number | null;
}
