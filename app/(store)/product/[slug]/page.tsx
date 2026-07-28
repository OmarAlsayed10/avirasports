import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Scale, ShieldCheck, Star } from 'lucide-react';
import { getProduct, getRelatedProducts, getBestSellers, getAlsoBought, getUserProductReview } from '@/modules/product/product.queries';
import { getProductOffers, getProductQuantityOffers } from '@/modules/admin/offers/offers.queries';
import { OfferBanner } from '@/modules/product/components/offer-banner';
import { QuantityOfferPopup } from '@/modules/product/components/quantity-offer-popup';
import { auth } from '@/infrastructure/auth/auth.config';
import { Breadcrumb } from '@/modules/_shared/ui/breadcrumb';
import { PriceDisplay } from '@/modules/_shared/ui/price-display';
import { ProductDetailSection } from '@/modules/product/components/product-detail-section';
import { ProductSpecs } from '@/modules/product/components/product-specs';
import { ReviewsList } from '@/modules/product/components/reviews-list';
import { ReviewForm } from '@/modules/product/components/review-form';
import { RelatedProducts } from '@/modules/product/components/related-products';
import { ProductGridSkeleton } from '@/modules/product/components/product-grid';
import { ProductViewTracker } from '@/modules/product/components/product-view-tracker';
import { getLocale, getT } from '@/modules/_shared/i18n/locale';
import { specRowSchema } from '@/modules/product/product.validators';
import type { SpecRow } from '@/modules/product/product.validators';
import type { Translations } from '@/modules/_shared/i18n/i18n.translations';
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
  hasReturnPolicy,
  sizeWeights,
}: {
  description: string;
  specs: SpecRow[];
  reviews: Parameters<typeof ReviewsList>[0]['reviews'];
  locale: 'en' | 'ar';
  reviewGate: React.ReactNode;
  t: Translations;
  hasReturnPolicy?: boolean;
  sizeWeights?: { id: string; size: string; minWeightKg: unknown; maxWeightKg: unknown }[];
}) {
  return (
    <div className="border-t border-border-primary/20 pt-8">
      <div className="grid gap-8">
        <section>
          <h2 className="text-newsletter-sub font-semibold text-text-primary mb-4">{t.product.descriptionTab}</h2>
          <p className="text-base text-text-body leading-relaxed">{description}</p>
          {hasReturnPolicy && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3.5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {locale === 'ar' ? 'ضمان الاستبدال والاسترجاع' : 'Replacement & refund promise'}
                </p>
                <p className="mt-0.5 text-sm leading-6 text-text-secondary">
                  {locale === 'ar'
                    ? 'استبدال خلال 14 يوم واسترجاع المبلغ عند استلام المندوب للطلب.'
                    : '14-day replacement and refund when delivery is with the courier.'}
                </p>
              </div>
            </div>
          )}
          {sizeWeights && sizeWeights.length > 0 && (
            <div className="mt-6 rounded-xl border border-border-primary/20 bg-bg-page p-4">
              <div className="flex items-center gap-2 text-text-primary">
                <Scale className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{locale === 'ar' ? 'دليل الوزن حسب المقاس' : 'Size & weight guide'}</h3>
              </div>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {sizeWeights.map((weight) => (
                  <div key={weight.id} className="flex items-center justify-between rounded-lg bg-bg-white px-3 py-2 border border-border-primary/10">
                    <span className="font-semibold text-text-primary">{weight.size}</span>
                    <span className="text-sm text-text-secondary">
                      {weight.minWeightKg != null && weight.maxWeightKg != null
                        ? `${Number(weight.minWeightKg)}–${Number(weight.maxWeightKg)} kg`
                        : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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

async function RelatedSections({
  productId,
  categoryId,
  t,
}: {
  productId: string;
  categoryId: string;
  t: Translations;
}) {
  const [related, alsoBought, bestSellers] = await Promise.all([
    getRelatedProducts(productId, categoryId).catch(() => []),
    getAlsoBought(productId).catch(() => []),
    getBestSellers(4, productId).catch(() => []),
  ]);
  return (
    <>
      {alsoBought.length > 0 && (
        <div className="mt-16">
          <RelatedProducts title={t.product.alsoBought} products={alsoBought.map(toCardData)} />
        </div>
      )}
      {bestSellers.length > 0 && (
        <div className="mt-16">
          <RelatedProducts title={t.product.bestSellers} products={bestSellers.map(toCardData)} />
        </div>
      )}
      {related.length > 0 && (
        <div className="mt-16">
          <RelatedProducts title={t.product.similarProducts} products={related.map(toCardData)} />
        </div>
      )}
    </>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [product, { locale, t }, session] = await Promise.all([
    getProduct(params.slug),
    Promise.resolve(getT()),
    auth(),
  ]);
  if (!product) notFound();

  const userId = session?.user?.id ?? null;

  const [existingReview, offers, quantityOffers] = await Promise.all([
    userId ? getUserProductReview(product.id, userId).catch(() => null) : Promise.resolve(null),
    getProductOffers(product.id).catch(() => []),
    getProductQuantityOffers(product.id).catch(() => []),
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
    imageUrl: v.imageUrl ?? null,
  }));

  return (
    <div className="max-w-content mx-auto px-site py-8">
      <ProductViewTracker
        id={product.id}
        name={product.name}
        category={product.category?.name}
        price={basePrice}
      />
      <Breadcrumb
        items={[
          { label: t.shop.breadcrumb, href: '/shop' },
          { label: displayCategoryName, href: `/shop?category=${product.category.slug}` },
          { label: displayName },
        ]}
      />

      <ProductDetailSection
        images={product.images.map((img) => ({ url: img.url, alt: img.alt }))}
        productName={displayName}
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
        quantityOffers={quantityOffers.map((qo) => ({
          id: qo.id,
          quantity: qo.quantity,
          offerPriceEgp: Number(qo.offerPriceEgp),
        }))}
      >
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

        <PriceDisplay
          priceEgp={basePrice}
          discountPercent={product.discountPercent}
          size="lg"
        />

        {specs.length > 0 && <ProductSpecs specs={specs} locale={locale} />}

        <OfferBanner offers={offers} locale={locale} />
      </ProductDetailSection>



      <div className="mt-12">
        <TabsSection
          description={displayDescription}
          specs={specs}
          locale={locale}
          t={t}
          hasReturnPolicy={product.hasReturnPolicy}
          sizeWeights={product.sizeWeights}
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

      <Suspense fallback={<div className="mt-16"><ProductGridSkeleton count={4} /></div>}>
        <RelatedSections productId={product.id} categoryId={product.categoryId} t={t} />
      </Suspense>

      {quantityOffers.length > 0 && (
        <QuantityOfferPopup
          offers={quantityOffers.map((qo) => ({
            id: qo.id,
            quantity: qo.quantity,
            offerPriceEgp: Number(qo.offerPriceEgp),
            popupIntervalMinutes: qo.popupIntervalMinutes,
          }))}
          productId={product.id}
          productName={displayName}
          basePrice={basePrice}
          locale={locale}
        />
      )}
    </div>
  );
}
