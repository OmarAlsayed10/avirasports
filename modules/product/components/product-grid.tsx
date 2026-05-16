import { ProductCard, type ProductCardData } from './product-card';
import { productTokens } from '../product.tokens';

interface ProductGridProps {
  products: ProductCardData[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div
      className={productTokens.grid.root}
      aria-label="Product listing"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className={productTokens.grid.root}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={productTokens.grid.skeletonCard}
          aria-hidden="true"
        >
          <div className={productTokens.grid.skeletonImage} />
          <div className={productTokens.grid.skeletonBody}>
            <div className={`h-3 ${productTokens.grid.skeletonLine} w-16`} />
            <div className={`h-4 ${productTokens.grid.skeletonLine} w-full`} />
            <div className={`h-4 ${productTokens.grid.skeletonLine} w-3/4`} />
            <div className={`h-3 ${productTokens.grid.skeletonLine} w-20`} />
            <div className={`h-5 ${productTokens.grid.skeletonLine} w-24 mt-2`} />
          </div>
          <div className="px-4 pb-4">
            <div className={productTokens.grid.skeletonBtn} />
          </div>
        </div>
      ))}
    </div>
  );
}
