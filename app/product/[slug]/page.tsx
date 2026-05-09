import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import { getProduct, getRelatedProducts, getBestSellers, getAlsoBought, getUserProductReview } from '@/lib/queries/products';
import { auth } from '@/lib/auth';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { PriceDisplay } from '@/components/shared/price-display';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductSpecs } from '@/components/product/product-specs';
import { AddToCartSection } from '@/components/product/add-to-cart-section';
import { ReviewsList } from '@/components/product/reviews-list';
import { ReviewForm } from '@/components/product/review-form';
import { RelatedProducts } from '@/components/product/related-products';
import { getLocale, getT } from '@/lib/locale';
import { specRowSchema } from '@/lib/validators/admin-product';
import type { SpecRow } from '@/lib/validators/admin-product';
import type { Translations } from '@/lib/i18n/translations';
import { z } from 'zod';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Product Not Found' };
  const locale = getLocale();
  const name = locale === 'ar' && product.nameAr ? product.nameAr : product.name;
  const desc = locale === 'ar' && product.descriptionAr ? product.descriptionAr : product.description;
  const description = desc.slice(0, 155);
  const image = product.images[0]?.url;
  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      images: image ? [{ url: image, alt: product.name }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: image ? [image] : [],
    },
  };
}

function ReviewGate({
  productId,
  userId,
  alreadyReviewed,
  t,
}: {
  productId: string;
  userId: string | null;
  alreadyReviewed: boolean;
  t: Translations;
}) {
  if (!userId) {
    return (
      <div className="mb-8 p-4 border border-border-primary/20 rounded-xl bg-bg-white dark:bg-bg-surface">
        <p className="text-sm text-text-secondary">
          {t.product.signInToReview}{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            {t.product.signInLink}
          </Link>
        </p>
      </div>
    );
  }
  if (alreadyReviewed) {
    return (
      <div className="mb-6 p-4 bg-gray-50 dark:bg-bg-dark rounded-lg text-sm text-text-secondary">
        {t.product.alreadyReviewed}
      </div>
    );
  }
  return <ReviewForm productId={productId} />;
}

function TabsSection({
  description,
  specs,
  reviews,
  locale,
  reviewGate,
  t,
}: {
  description: string;
  specs: SpecRow[];
  reviews: Parameters<typeof ReviewsList>[0]['reviews'];
  locale: 'en' | 'ar';
  reviewGate: React.ReactNode;
  t: Translations;
}) {
  return (
    <div className="border-t border-border-primary/20 pt-8">
      <div className="grid gap-8">
        <section>
          <h2 className="text-newsletter-sub font-semibold text-text-primary mb-4">{t.product.descriptionTab}</h2>
          <p className="text-base text-text-body leading-relaxed">{description}</p>
        </section>
        {specs.length > 0 && (
          <section>
            <h2 className="text-newsletter-sub font-semibold text-text-primary mb-4">{t.product.specificationsTab}</h2>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3">
              {specs.map((entry, i) => {
                const label = locale === 'ar' && entry.keyAr ? entry.keyAr : entry.key;
                const value = locale === 'ar' && entry.valueAr ? entry.valueAr : entry.value;
                return (
                  <div key={i} className="flex gap-2">
                    <dt className="text-sm text-text-secondary capitalize w-28 flex-shrink-0">{label}</dt>
                    <dd className="text-sm font-medium text-text-primary">{value}</dd>
                  </div>
                );
              })}
            </dl>
          </section>
        )}
        <section>
          <h2 className="text-newsletter-sub font-semibold text-text-primary mb-6">
            {t.product.reviews} ({reviews.length})
          </h2>
          {reviewGate}
          <ReviewsList reviews={reviews} />
        </section>
      </div>
    </div>
  );
}

function toCardData(p: {
  id: string;
  slug: string;
  name: string;
  brand: string;
  basePriceEgp: number | { toNumber: () => number };
  discountPercent: number | null;
  ratingAvg: number;
  reviewCount: number;
  images: { url: string; alt: string }[];
  variants: { stockCount: number }[];
  category?: { slug: string; name: string };
}) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    basePriceEgp: typeof p.basePriceEgp === 'object' ? p.basePriceEgp.toNumber() : Number(p.basePriceEgp),
    discountPercent: p.discountPercent,
    ratingAvg: p.ratingAvg,
    reviewCount: p.reviewCount,
    images: p.images,
    variants: p.variants,
    category: p.category,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [product, { locale, t }, session] = await Promise.all([
    getProduct(params.slug),
    Promise.resolve(getT()),
    auth(),
  ]);
  if (!product) notFound();

  const userId = session?.user?.id ?? null;

  const [related, alsoBought, bestSellers, existingReview] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId).catch(() => []),
    getAlsoBought(product.id).catch(() => []),
    getBestSellers(4, product.id).catch(() => []),
    userId ? getUserProductReview(product.id, userId).catch(() => null) : Promise.resolve(null),
  ]);

  const basePrice = Number(product.basePriceEgp);
  const primaryImage = product.images[0]?.url ?? '/placeholder-product.jpg';

  const rawSpecs = product.specs;
  const specsArrayResult = z.array(specRowSchema).safeParse(rawSpecs);
  const specs: SpecRow[] = specsArrayResult.success
    ? specsArrayResult.data
    : Object.entries((rawSpecs ?? {}) as Record<string, string>).map(([key, value]) => ({
        key, keyAr: '', value, valueAr: '',
      }));

  const displayName = locale === 'ar' && product.nameAr ? product.nameAr : product.name;
  const displayDescription =
    locale === 'ar' && product.descriptionAr ? product.descriptionAr : product.description;
  const displayCategoryName =
    locale === 'ar' && product.category.nameAr ? product.category.nameAr : product.category.name;

  const variants = product.variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    attributes: v.attributes as Record<string, string>,
    priceOverrideEgp: v.priceOverrideEgp ? Number(v.priceOverrideEgp) : null,
    stockCount: v.stockCount,
  }));

  const totalStock = variants.reduce((sum, v) => sum + v.stockCount, 0);

  return (
    <div className="max-w-content mx-auto px-site py-8">
      <Breadcrumb
        items={[
          { label: t.shop.breadcrumb, href: '/shop' },
          { label: displayCategoryName, href: `/shop?category=${product.category.slug}` },
          { label: displayName },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-6">
        {/* Gallery */}
        <ProductGallery
          images={product.images.map((img) => ({ url: img.url, alt: img.alt }))}
          productName={displayName}
        />

        {/* Info panel */}
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">{product.brand}</p>
            <h1 className="text-detail-title font-semibold text-text-primary leading-tight">
              {displayName}
            </h1>
            {product.modelNumber && (
              <p className="text-sm text-text-secondary mt-1">
                {t.product.model}: {product.modelNumber}
              </p>
            )}
          </div>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex" aria-label={`${product.ratingAvg} out of 5 stars`} aria-hidden="true">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(product.ratingAvg)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-text-secondary">
                {product.ratingAvg.toFixed(1)} ({t.product.ratingCount(product.reviewCount)})
              </span>
            </div>
          )}

          {/* Price */}
          <PriceDisplay
            priceEgp={basePrice}
            discountPercent={product.discountPercent}
            size="lg"
          />

          {/* Key specs summary */}
          {specs.length > 0 && <ProductSpecs specs={specs} locale={locale} />}

          {/* Add to cart */}
          <AddToCartSection
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              nameAr: product.nameAr ?? undefined,
              brand: product.brand,
              imageUrl: primaryImage,
              basePriceEgp: basePrice,
              discountPercent: product.discountPercent,
            }}
            variants={variants}
          />

          {/* Stock indicator */}
          {totalStock > 0 ? (
            <p className="text-sm text-success font-medium">{t.product.inStock}</p>
          ) : (
            <p className="text-sm text-sale font-medium">{t.product.outOfStock}</p>
          )}
        </div>
      </div>

      {/* Description / Specs / Reviews */}
      <div className="mt-12">
        <TabsSection
          description={displayDescription}
          specs={specs}
          locale={locale}
          t={t}
          reviews={product.reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            title: r.title,
            body: r.body,
            createdAt: r.createdAt,
            user: { name: r.user.name, image: r.user.image },
          }))}
          reviewGate={
            <ReviewGate
              productId={product.id}
              userId={userId}
              alreadyReviewed={!!existingReview}
              t={t}
            />
          }
        />
      </div>

      {/* Customers Also Bought */}
      {alsoBought.length > 0 && (
        <div className="mt-16">
          <RelatedProducts
            title={t.product.alsoBought}
            products={alsoBought.map(toCardData)}
          />
        </div>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <div className="mt-16">
          <RelatedProducts
            title={t.product.bestSellers}
            products={bestSellers.map(toCardData)}
          />
        </div>
      )}

      {/* Similar Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <RelatedProducts
            title={t.product.similarProducts}
            products={related.map(toCardData)}
          />
        </div>
      )}
    </div>
  );
}
