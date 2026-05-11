import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSectionProducts, type HomepageSectionRow } from '@/lib/queries/homepage';
import { ProductCard } from '@/components/product/product-card';
import { getT } from '@/lib/locale';

function shopLink(section: HomepageSectionRow): string {
  if (section.type === 'BEST_VALUE') return '/shop?sort=price_asc';
  if (section.type === 'HOLIDAY_OFFERS') return '/shop?onSale=true';
  if (section.type === 'CATEGORY_SHOWCASE' && section.category) {
    return `/shop?category=${section.category.slug}`;
  }
  return '/shop?sort=featured';
}

export async function HomepageProductSection({ section }: { section: HomepageSectionRow }) {
  const { locale, t } = getT();

  const products = await getSectionProducts(section);
  if (products.length === 0) return null;

  const title = locale === 'ar' && section.titleAr ? section.titleAr : section.title;
  const href = shopLink(section);

  return (
    <section className="py-12 bg-bg-page dark:bg-bg-dark" aria-label={title}>
      <div className="max-w-content mx-auto px-site">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary dark:text-text-on-dark">
            {title}
          </h2>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-btn hover:underline"
          >
            {t.home.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              priority={index === 0}
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                nameAr: product.nameAr ?? undefined,
                brand: product.brand,
                basePriceEgp: Number(product.basePriceEgp),
                discountPercent: product.discountPercent,
                ratingAvg: product.ratingAvg,
                reviewCount: product.reviewCount,
                images: product.images.map((img) => ({ url: img.url, alt: img.alt ?? product.name })),
                variants: product.variants,
                category: product.category ?? undefined,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
