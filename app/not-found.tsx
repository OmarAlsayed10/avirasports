import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-site text-center py-20">
      <p className="text-8xl font-semibold text-primary/20 mb-6 select-none" aria-hidden="true">
        404
      </p>
      <h1 className="text-section-heading font-semibold text-text-primary mb-3">
        Page Not Found
      </h1>
      <p className="text-nav-sm text-text-secondary mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Try browsing our product catalogue instead.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-primary dark:bg-white text-text-on-dark dark:text-primary rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 dark:hover:bg-white/90 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/shop"
          className="px-6 py-3 border border-border-primary/40 dark:border-white/30 text-text-primary dark:text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:border-primary dark:hover:border-white/60 transition-colors"
        >
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
