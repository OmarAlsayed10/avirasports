import { getT } from '@/lib/locale';

export async function TrustSection() {
  const { t } = getT();

  const TRUST_ITEMS = [
    { title: t.home.trustFreeDeliveryTitle, desc: t.home.trustFreeDeliverySub },
    { title: t.home.trustAuthenticTitle, desc: t.home.trustAuthenticSub },
    { title: t.home.trustPerformanceTitle, desc: t.home.trustPerformanceSub },
    { title: t.home.trustReturnsTitle, desc: t.home.trustReturnsSub },
  ];

  return (
    <section className="py-10 bg-bg-white dark:bg-bg-surface" aria-label="Why shop with Avira">
      <div className="max-w-content mx-auto px-site">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_ITEMS.map(({ title, desc }) => (
            <div key={title} className="flex flex-col gap-2 p-4 rounded-carousel border border-border-primary/10 dark:border-white/10">
              <p className="text-sm font-semibold text-text-primary dark:text-text-on-dark">{title}</p>
              <p className="text-xs text-text-secondary dark:text-text-footer-link leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
