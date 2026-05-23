export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  nameAr?: string | null;
  brand: string;
  basePriceEgp: number | { toNumber: () => number };
  discountPercent: number | null;
  ratingAvg: number;
  reviewCount: number;
  images: { url: string; alt: string }[];
  variants: { stockCount: number }[];
  category?: { slug: string; name: string };
};

export interface ProductCardProps {
  product: ProductCardData;
  priority?: boolean;
}
