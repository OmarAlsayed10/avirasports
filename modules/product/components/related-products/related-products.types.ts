import type { ProductCardData } from '../product-card/product-card.types';

export interface RelatedProductsProps {
  products: ProductCardData[];
  title?: string;
}
