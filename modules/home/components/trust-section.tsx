import { getT } from '@/modules/_shared/i18n/locale';
import { homeTokens } from '../home.tokens';

export async function TrustSection() {
  const { t } = getT();

  const TRUST_ITEMS = [
    { title: t.home.trustFreeDeliveryTitle, desc: t.home.trustFreeDeliverySub },
    { title: t.home.trustAuthenticTitle, desc: t.home.trustAuthenticSub },
    { title: t.home.trustPerformanceTitle, desc: t.home.trustPerformanceSub },
    { title: t.home.trustReturnsTitle, desc: t.home.trustReturnsSub },
  ];

  return (
    <section className={homeTokens.trust.section} aria-label="Why shop with Avira">
      <div className={homeTokens.trust.inner}>
        <div className={homeTokens.trust.grid}>
          {TRUST_ITEMS.map(({ title, desc }) => (
            <div key={title} className={homeTokens.trust.item}>
              <p className={homeTokens.trust.title}>{title}</p>
              <p className={homeTokens.trust.desc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
