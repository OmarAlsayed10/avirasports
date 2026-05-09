import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getT } from '@/lib/locale';

type DbCategory = { slug: string; name: string; nameAr: string | null; iconUrl: string | null };

export async function CategoryCards() {
  const { locale, t } = getT();

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { slug: true, name: true, nameAr: true, iconUrl: true },
  });

  if (categories.length === 0) return null;

  const [large1, large2, ...small] = categories;

  return (
    <section className="py-12 md:py-16 bg-bg-page dark:bg-bg-dark">
      <div className="max-w-content mx-auto px-site">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-btn mb-1">
              {t.home.disciplinesLabel}
            </p>
            <h2 className="font-secondary text-3xl md:text-5xl font-black uppercase tracking-tight text-text-primary dark:text-text-on-dark">
              {t.home.findYourSport}
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary dark:text-text-footer-link hover:text-primary-btn dark:hover:text-primary-btn transition-colors self-start md:self-auto"
          >
            {t.home.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {large1 && (
          <div className={`grid gap-4 mb-4 ${large2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <CategoryCard cat={large1} locale={locale} shopLabel={t.home.shopCollection} minHeight="min-h-[220px] md:min-h-[280px]" />
            {large2 && <CategoryCard cat={large2} locale={locale} shopLabel={t.home.shopCollection} minHeight="min-h-[220px] md:min-h-[280px]" />}
          </div>
        )}

        {small.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {small.map((cat) => (
              <CategoryCard key={cat.slug} cat={cat} locale={locale} shopLabel={t.home.shopCollection} minHeight="min-h-[130px] md:min-h-[160px]" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryCard({
  cat,
  locale,
  shopLabel,
  minHeight,
}: {
  cat: DbCategory;
  locale: 'en' | 'ar';
  shopLabel: string;
  minHeight: string;
}) {
  const displayName = locale === 'ar' && cat.nameAr ? cat.nameAr : cat.name;
  return (
    <Link
      href={`/shop?category=${cat.slug}`}
      aria-label={`Shop ${displayName}`}
      className={`group relative overflow-hidden rounded-card-lg flex flex-col justify-between p-5 md:p-6 ${minHeight} border border-white/5 hover:border-white/15 transition-all duration-300 hover:scale-[1.015] cursor-pointer`}
    >
      {cat.iconUrl ? (
        <>
          <img src={cat.iconUrl} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#111111] to-[#1e1e1e]" />
      )}

      <div className="relative z-10 w-2 h-2 rounded-full bg-primary-btn flex-shrink-0" />
      <div className="relative z-10">
        <p className="font-secondary text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-none">
          {displayName}
        </p>
        <p className="flex items-center gap-1 text-xs text-white/50 mt-1.5 group-hover:text-white/75 transition-colors">
          {shopLabel}
          <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </p>
      </div>
    </Link>
  );
}
