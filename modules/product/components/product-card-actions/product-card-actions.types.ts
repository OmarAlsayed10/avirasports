export interface ProductCardActionsProps {
  product: {
    id: string;
    slug: string;
    name: string;
    nameAr?: string;
    brand: string;
    imageUrl: string;
    unitPriceEgp: number;
    stockCount: number;
  };
}

export interface WishlistToggleProps {
  productId: string;
  name: string;
  brand: string;
  imageUrl: string;
  priceEgp: number;
  discountPercent?: number | null;
  slug: string;
}
