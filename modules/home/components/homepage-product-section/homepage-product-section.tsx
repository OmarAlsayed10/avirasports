import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSectionProducts, type HomepageSectionRow } from '@/modules/home/home.queries';
import { ProductCard } from '@/modules/product/components/product-card';
import { getT } from '@/modules/_shared/i18n/locale';
import { homepageProductSectionTokens } from './homepage-product-section.tokens';
import type { HomepageProductSectionProps } from './homepage-product-section.types';

function shopLink(section: HomepageSectionRow): string {
  if (section.type === 'BEST_VALUE') return '/shop?sort=price_asc';
  if (section.type === 'HOLIDAY_OFFERS') return '/shop?onSale=true';
  if (section.type === 'CATEGORY_SHOWCASE' && section.category) {
    return `/shop?category=${section.category.slug}`;
  }
  return '/shop?sort=featured';
}

export async function HomepageProductSection({ section }: HomepageProductSectionProps) {
  const { locale, t } = getT();

  const products = await getSectionProducts(section);
  if (products.length === 0) return null;

  const title = locale === 'ar' && section.titleAr ? section.titleAr : section.title;
  const href = shopLink(section);

  return (
    <section className={homepageProductSectionTokens.base} aria-label={title}>
      <div className={homepageProductSectionTokens.inner}>
        <div className={homepageProductSectionTokens.header}>
          <h2 className={homepageProductSectionTokens.heading}>{title}</h2>
          <Link href={href} className={homepageProductSectionTokens.viewAllLink}>
            {t.home.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className={homepageProductSectionTokens.grid}>
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
