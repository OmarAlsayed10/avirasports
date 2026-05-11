import { ProductGridSkeleton } from '@/components/product/product-grid';

export default function ShopLoading() {
  return (
    <div className="max-w-content mx-auto px-site py-8">
      {/* Breadcrumb skeleton */}
      <div className="h-4 bg-indicator-inactive dark:bg-bg-surface rounded w-24 animate-pulse" />

      {/* Heading skeleton */}
      <div className="h-8 bg-indicator-inactive dark:bg-bg-surface rounded w-64 animate-pulse mt-4 mb-6" />

      <div className="flex gap-8 mt-4">
        {/* Sidebar skeleton — desktop only */}
        <div className="hidden md:flex flex-col gap-6 w-sidebar flex-shrink-0">
          {[120, 180, 100, 140, 80].map((w) => (
            <div key={w} className="space-y-3">
              <div className="h-4 bg-indicator-inactive dark:bg-bg-surface rounded animate-pulse" style={{ width: w }} />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-3 bg-indicator-inactive dark:bg-bg-surface rounded animate-pulse w-full opacity-60" />
              ))}
            </div>
          ))}
        </div>

        {/* Product grid skeleton */}
        <div className="flex-1 min-w-0">
          {/* Sort row skeleton — desktop */}
          <div className="hidden md:flex justify-end mb-6">
            <div className="h-10 bg-indicator-inactive dark:bg-bg-surface rounded-btn-sm w-44 animate-pulse" />
          </div>
          <ProductGridSkeleton count={12} />
        </div>
      </div>
    </div>
  );
}
