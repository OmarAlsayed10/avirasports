import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/modules/_shared/i18n/locale";

export const metadata: Metadata = {
  title: "About Avira — Sports Gear in Egypt",
  description:
    "Learn about Avira, your go-to destination for premium sports gear and athletic apparel in Egypt. Authentic products, free delivery, and easy returns.",
  openGraph: {
    title: "About Avira",
    description: "Your go-to destination for premium sports gear in Egypt.",
  },
};

export default function AboutPage() {
  const { t } = getT();

  const TRUST_ITEMS = [
    { title: t.about.authenticTitle, description: t.about.authenticSub },
    { title: t.about.performanceTitle, description: t.about.performanceSub },
    { title: t.about.returnsTitle, description: t.about.returnsSub },
  ];

  return (
    <main className="max-w-content mx-auto px-site py-12 space-y-16">
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="font-secondary text-3xl md:text-4xl font-black uppercase tracking-tight text-text-primary dark:text-text-on-dark">
          {t.about.heading}
        </h1>
        <p className="text-base text-text-secondary dark:text-text-footer-link leading-relaxed">
          {t.about.body}
        </p>
      </section>

      <section>
        <h2 className="font-secondary text-2xl md:text-3xl font-black uppercase tracking-tight text-text-primary dark:text-text-on-dark mb-8 text-center">
          {t.about.whyShop}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className="bg-bg-white dark:bg-bg-surface rounded-card-lg p-6 shadow-newsletter space-y-2"
            >
              <h3 className="text-base font-semibold text-text-primary dark:text-text-on-dark">
                {item.title}
              </h3>
              <p className="text-sm text-text-secondary dark:text-text-footer-link leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="text-center space-y-4">
        <p className="text-base text-text-secondary dark:text-text-footer-link">
          {t.about.readyTitle}
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center h-12 px-8 bg-primary text-text-on-dark rounded-btn-sm text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          {t.about.browseShop}
        </Link>
      </section>
    </main>
  );
}
