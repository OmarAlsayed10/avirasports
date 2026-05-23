export interface AddToCartSectionProduct {
  id: string;
  slug: string;
  name: string;
  nameAr?: string | null;
  brand: string;
  imageUrl: string;
  basePriceEgp: number;
  discountPercent: number | null;
}

export interface AddToCartSectionProps {
  product: AddToCartSectionProduct;
  variants: import('../variant-selector/variant-selector.types').VariantOption[];
}
