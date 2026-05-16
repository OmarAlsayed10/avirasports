'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PriceDisplay } from '@/modules/_shared/ui/price-display';
import { StarRating } from '@/modules/_shared/ui/star-rating';
import { WishlistToggle, QuickAddButton } from './product-card-actions';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { calcDiscountedPrice } from '@/modules/_shared/utils/calc-discounted-price';
import { productTokens } from '../product.tokens';

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

  const discountedPrice = calcDiscountedPrice(basePrice, product.discountPercent);

  const imageUrl = product.images[0]?.url ?? '/placeholder-product.jpg';
  const imageAlt = product.images[0]?.alt ?? product.name;
  const totalStock = product.variants.reduce((sum, v) => sum + v.stockCount, 0);

  return (
    <article className={productTokens.card.root}>
      <Link href={`/product/${product.slug}`} className={productTokens.card.linkWrapper}>
        <div className={productTokens.card.imageWrapper}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority={priority}
            className={productTokens.card.image}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {product.discountPercent && (
            <span className={productTokens.card.discountBadge}>
              -{product.discountPercent}%
            </span>
          )}
          {totalStock === 0 && (
            <div className={productTokens.card.outOfStockOverlay}>
              <span className={productTokens.card.outOfStockLabel}>{t.product.outOfStock}</span>
            </div>
          )}
        </div>

        <div className={productTokens.card.body}>
          <p className={productTokens.card.brand}>{product.brand}</p>
          <h3 className={productTokens.card.name}>
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

      <div className={productTokens.card.actions}>
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

      <div className={productTokens.card.wishlistWrapper}>
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
