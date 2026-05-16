export function calcDiscountedPrice(basePrice: number, discountPercent: number | null | undefined): number {
  return discountPercent ? Math.round(basePrice * (1 - discountPercent / 100)) : basePrice;
}
