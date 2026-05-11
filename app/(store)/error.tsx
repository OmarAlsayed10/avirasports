'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-site text-center py-20">
      <p className="text-8xl font-semibold text-sale/20 mb-6 select-none" aria-hidden="true">!</p>
      <h2 className="text-section-heading font-semibold text-text-primary mb-3">
        Something went wrong
      </h2>
      <p className="text-nav-sm text-text-secondary mb-8 max-w-md">
        An unexpected error occurred. Please try again or return to the home page.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary dark:bg-white text-text-on-dark dark:text-primary rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 dark:hover:bg-white/90 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-border-primary/40 dark:border-white/30 text-text-primary dark:text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:border-primary dark:hover:border-white/60 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
