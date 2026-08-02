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
  quantityOffers?: { id: string; quantity: number; offerPriceEgp: number }[];
  addOnOptions?: { id: string; name: string; nameAr?: string | null; basePriceEgp: number }[];
  onVariantPreview?: (variant: import('../variant-selector/variant-selector.types').VariantOption | null) => void;
}
