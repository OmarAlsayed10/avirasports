export default function ProductLoading() {
  return (
    <div className="max-w-content mx-auto px-site py-8">
      {/* Breadcrumb */}
      <div className="h-4 bg-indicator-inactive dark:bg-bg-surface rounded w-48 animate-pulse" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-6">
        {/* Gallery skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-indicator-inactive dark:bg-bg-surface rounded-carousel animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-16 bg-indicator-inactive dark:bg-bg-surface rounded-tag animate-pulse" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-3 bg-indicator-inactive dark:bg-bg-surface rounded w-24 animate-pulse" />
          <div className="h-8 bg-indicator-inactive dark:bg-bg-surface rounded w-3/4 animate-pulse" />
          <div className="h-8 bg-indicator-inactive dark:bg-bg-surface rounded w-1/2 animate-pulse" />
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-indicator-inactive dark:bg-bg-surface rounded w-full animate-pulse" />
            <div className="h-4 bg-indicator-inactive dark:bg-bg-surface rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-indicator-inactive dark:bg-bg-surface rounded w-4/6 animate-pulse" />
          </div>
          <div className="h-12 bg-indicator-inactive dark:bg-bg-surface rounded-btn-sm w-full animate-pulse mt-4" />
          <div className="h-12 bg-indicator-inactive dark:bg-bg-surface rounded-btn-sm w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
