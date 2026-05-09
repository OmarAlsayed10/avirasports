import { ProductGridSkeleton } from '@/components/product/product-grid';

export default function RootLoading() {
  return (
    <div className="max-w-content mx-auto px-site py-12">
      <div className="h-8 bg-indicator-inactive dark:bg-bg-surface rounded w-48 animate-pulse mb-8" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
