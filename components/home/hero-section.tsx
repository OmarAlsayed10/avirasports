import Link from 'next/link';
import { getT } from '@/lib/locale';

export async function HeroSection() {
  const { locale, t } = getT();

  return (
    <section
      className="relative bg-primary dark:bg-white overflow-hidden min-h-[280px] md:min-h-hero"
      aria-label="Hero"
    >
      {/* Green glow — decorative */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-primary-btn/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-content mx-auto px-site py-12 md:py-0 md:h-hero flex items-center">
        <div className="max-w-xl">
          <p className="text-xs md:text-nav-sm font-medium text-text-footer-link dark:text-text-secondary mb-2 md:mb-3 uppercase tracking-widest">
            {t.home.freeBadge}
          </p>
          <h1 className="font-secondary text-5xl sm:text-6xl md:text-7xl font-black uppercase leading-none tracking-tight text-text-on-dark dark:text-text-primary mb-3 md:mb-4">
            {locale === 'ar' ? (
              t.home.heroHeading
            ) : (
              <>Move<br /><span className="text-primary-btn">Free.</span></>
            )}
          </h1>
          <p className="text-base md:text-lg text-text-footer-link dark:text-text-secondary mb-6 md:mb-8 leading-relaxed">
            {t.home.heroSub}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="px-6 md:px-8 py-3 md:py-3.5 bg-primary-btn text-bg-dark rounded-btn-sm text-sm font-semibold hover:bg-primary-btn/90 transition-colors"
            >
              {t.home.shopNow}
            </Link>
            <Link
              href="/shop?onSale=true"
              className="px-6 md:px-8 py-3 md:py-3.5 border-2 border-text-on-dark dark:border-text-primary text-text-on-dark dark:text-text-primary rounded-btn-sm text-sm font-semibold hover:bg-text-on-dark/10 dark:hover:bg-text-primary/10 transition-colors"
            >
              {t.home.viewDeals}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
