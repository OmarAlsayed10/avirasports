import type { ProductCardData } from '../product-card/product-card.types';

export interface ProductGridProps {
  products: ProductCardData[];
}

export interface ProductGridSkeletonProps {
  count?: number;
}
