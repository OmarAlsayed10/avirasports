import { ProductCard, type ProductCardData } from './product-card';

interface ProductGridProps {
  products: ProductCardData[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
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
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-bg-white rounded-carousel border border-border-primary/10 overflow-hidden animate-pulse"
          aria-hidden="true"
        >
          <div className="aspect-square bg-bg-page" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-bg-page rounded w-16" />
            <div className="h-4 bg-bg-page rounded w-full" />
            <div className="h-4 bg-bg-page rounded w-3/4" />
            <div className="h-3 bg-bg-page rounded w-20" />
            <div className="h-5 bg-bg-page rounded w-24 mt-2" />
          </div>
          <div className="px-4 pb-4">
            <div className="h-9 bg-bg-page rounded-btn-sm w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
