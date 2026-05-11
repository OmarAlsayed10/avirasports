'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PriceDisplay } from '@/components/shared/price-display';
import { StarRating } from '@/components/shared/star-rating';
import { WishlistToggle, QuickAddButton } from './product-card-actions';
import { useLocale } from '@/lib/i18n/context';

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  nameAr?: string | null;
  brand: string;
  basePriceEgp: number | { toNumber: () => number };
  discountPercent: number | null;
  ratingAvg: number;
  reviewCount: number;
  images: { url: string; alt: string }[];
  variants: { stockCount: number }[];
  category?: { slug: string; name: string };
};

interface ProductCardProps {
  product: ProductCardData;
  priority?: boolean;
}

export const ProductCard = memo(function ProductCard({ product, priority = false }: ProductCardProps) {
  const { locale, t } = useLocale();
  const displayName = locale === 'ar' && product.nameAr ? product.nameAr : product.name;
  const basePrice =
    typeof product.basePriceEgp === 'object'
      ? product.basePriceEgp.toNumber()
      : Number(product.basePriceEgp);

  const discountedPrice = product.discountPercent
    ? Math.round(basePrice * (1 - product.discountPercent / 100))
    : basePrice;

  const imageUrl = product.images[0]?.url ?? '/placeholder-product.jpg';
  const imageAlt = product.images[0]?.alt ?? product.name;
  const totalStock = product.variants.reduce((sum, v) => sum + v.stockCount, 0);

  return (
    <article className="group relative bg-bg-white dark:bg-bg-surface rounded-carousel border border-border-primary/10 dark:border-white/10 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square bg-bg-page dark:bg-bg-dark overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority={priority}
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {product.discountPercent && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-sale text-text-on-dark text-xs font-semibold rounded-tag">
              -{product.discountPercent}%
            </span>
          )}
          {totalStock === 0 && (
            <div className="absolute inset-0 bg-bg-white/70 dark:bg-bg-surface/70 flex items-center justify-center">
              <span className="text-sm font-semibold text-text-secondary dark:text-text-footer-link">{t.product.outOfStock}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-text-secondary dark:text-text-footer-link font-medium mb-1">{product.brand}</p>
          <h3 className="text-base font-semibold text-text-primary dark:text-text-on-dark leading-tight line-clamp-2 mb-2">
            {displayName}
          </h3>
          <StarRating rating={product.ratingAvg} count={product.reviewCount} />
          <div className="mt-2">
            <PriceDisplay
              priceEgp={basePrice}
              discountPercent={product.discountPercent ?? 0}
              size="sm"
            />
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        <QuickAddButton
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            nameAr: product.nameAr ?? undefined,
            brand: product.brand,
            imageUrl,
            unitPriceEgp: discountedPrice,
            stockCount: totalStock,
          }}
        />
      </div>

      {/* Wishlist */}
      <div className="absolute top-2 right-2">
        <WishlistToggle
          productId={product.id}
          name={product.name}
          brand={product.brand}
          imageUrl={imageUrl}
          priceEgp={basePrice}
          discountPercent={product.discountPercent}
          slug={product.slug}
        />
      </div>
    </article>
  );
});
