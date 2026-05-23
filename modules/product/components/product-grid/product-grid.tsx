import { ProductCard } from '../product-card/product-card';
import { productGridTokens } from './product-grid.tokens';
import type { ProductGridProps, ProductGridSkeletonProps } from './product-grid.types';
import type { ProductCardData } from '../product-card/product-card.types';

export type { ProductCardData };

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div
      className={productGridTokens.root}
      aria-label="Product listing"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }: ProductGridSkeletonProps) {
  return (
    <div className={productGridTokens.root}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={productGridTokens.skeletonCard}
          aria-hidden="true"
        >
          <div className={productGridTokens.skeletonImage} />
          <div className={productGridTokens.skeletonBody}>
            <div className={`h-3 ${productGridTokens.skeletonLine} w-16`} />
            <div className={`h-4 ${productGridTokens.skeletonLine} w-full`} />
            <div className={`h-4 ${productGridTokens.skeletonLine} w-3/4`} />
            <div className={`h-3 ${productGridTokens.skeletonLine} w-20`} />
            <div className={`h-5 ${productGridTokens.skeletonLine} w-24 mt-2`} />
          </div>
          <div className="px-4 pb-4">
            <div className={productGridTokens.skeletonBtn} />
          </div>
        </div>
      ))}
    </div>
  );
}
