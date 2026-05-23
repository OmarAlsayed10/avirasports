'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PriceDisplay } from '@/modules/_shared/ui/price-display';
import { StarRating } from '@/modules/_shared/ui/star-rating';
import { WishlistToggle, QuickAddButton } from '../product-card-actions/product-card-actions';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { calcDiscountedPrice } from '@/modules/_shared/utils/calc-discounted-price';
import { productCardTokens } from './product-card.tokens';
import type { ProductCardData, ProductCardProps } from './product-card.types';

export type { ProductCardData };

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
    <article className={productCardTokens.root}>
      <Link href={`/product/${product.slug}`} className={productCardTokens.linkWrapper}>
        <div className={productCardTokens.imageWrapper}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority={priority}
            className={productCardTokens.image}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {product.discountPercent && (
            <span className={productCardTokens.discountBadge}>
              -{product.discountPercent}%
            </span>
          )}
          {totalStock === 0 && (
            <div className={productCardTokens.outOfStockOverlay}>
              <span className={productCardTokens.outOfStockLabel}>{t.product.outOfStock}</span>
            </div>
          )}
        </div>

        <div className={productCardTokens.body}>
          <p className={productCardTokens.brand}>{product.brand}</p>
          <h3 className={productCardTokens.name}>
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

      <div className={productCardTokens.actions}>
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

      <div className={productCardTokens.wishlistWrapper}>
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
