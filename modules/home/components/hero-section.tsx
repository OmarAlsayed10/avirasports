import Link from 'next/link';
import { getT } from '@/modules/_shared/i18n/locale';
import { homeTokens } from '../home.tokens';

export async function HeroSection() {
  const { locale, t } = getT();

  return (
    <section className={homeTokens.hero.root} aria-label="Hero">
      <div className={homeTokens.hero.glow} aria-hidden="true" />

      <div className={homeTokens.hero.inner}>
        <div className={homeTokens.hero.content}>
          <p className={homeTokens.hero.eyebrow}>{t.home.freeBadge}</p>
          <h1 className={homeTokens.hero.heading}>
            {locale === 'ar' ? (
              t.home.heroHeading
            ) : (
              <>Move<br /><span className={homeTokens.hero.headingAccent}>Free.</span></>
            )}
          </h1>
          <p className={homeTokens.hero.sub}>{t.home.heroSub}</p>
          <div className={homeTokens.hero.ctaRow}>
            <Link href="/shop" className={homeTokens.hero.primaryCta}>
              {t.home.shopNow}
            </Link>
            <Link href="/shop?onSale=true" className={homeTokens.hero.secondaryCta}>
              {t.home.viewDeals}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
