import { getT } from '@/modules/_shared/i18n/locale';
import { trustSectionTokens } from './trust-section.tokens';

export async function TrustSection() {
  const { t } = getT();

  const TRUST_ITEMS = [
    { title: t.home.trustAuthenticTitle, desc: t.home.trustAuthenticSub },
    { title: t.home.trustPerformanceTitle, desc: t.home.trustPerformanceSub },
    { title: t.home.trustReturnsTitle, desc: t.home.trustReturnsSub },
  ];

  return (
    <section className={trustSectionTokens.section} aria-label="Why shop with Avira">
      <div className={trustSectionTokens.inner}>
        <div className={trustSectionTokens.grid}>
          {TRUST_ITEMS.map(({ title, desc }) => (
            <div key={title} className={trustSectionTokens.item}>
              <p className={trustSectionTokens.title}>{title}</p>
              <p className={trustSectionTokens.desc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
