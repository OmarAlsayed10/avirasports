import Link from 'next/link';
import { getT } from '@/modules/_shared/i18n/locale';
import { heroSectionTokens } from './hero-section.tokens';

export async function HeroSection() {
  const { locale, t } = getT();

  return (
    <section className={heroSectionTokens.root} aria-label="Hero">
      <div className={heroSectionTokens.glow} aria-hidden="true" />

      <div className={heroSectionTokens.inner}>
        <div className={heroSectionTokens.content}>
\          <h1 className={heroSectionTokens.heading}>
            {locale === 'ar' ? (
              t.home.heroHeading
            ) : (
              <>Move<br /><span className={heroSectionTokens.headingAccent}>Free.</span></>
            )}
          </h1>
          <p className={heroSectionTokens.sub}>{t.home.heroSub}</p>
          <div className={heroSectionTokens.ctaRow}>
            <Link href="/shop" className={heroSectionTokens.primaryCta}>
              {t.home.shopNow}
            </Link>
            <Link href="/shop?onSale=true" className={heroSectionTokens.secondaryCta}>
              {t.home.viewDeals}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
