export interface CouponInputProps {
  subtotalEgp: number;
  onApplied: (discount: { discountEgp: number; code: string }) => void;
  appliedCode?: string | null;
}
