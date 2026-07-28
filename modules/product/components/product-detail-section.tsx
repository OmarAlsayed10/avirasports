'use client';

import { useState } from 'react';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { ProductGallery } from './product-gallery';
import { AddToCartSection } from './add-to-cart-section';
import type { VariantOption } from './variant-selector/variant-selector.types';
import type { AddToCartSectionProduct } from './add-to-cart-section/add-to-cart-section.types';

interface ProductDetailSectionProps {
  images: { url: string; alt: string }[];
  productName: string;
  product: AddToCartSectionProduct;
  variants: VariantOption[];
  quantityOffers?: { id: string; quantity: number; offerPriceEgp: number }[];
  children: React.ReactNode;
}

export function ProductDetailSection({ images, productName, product, variants, quantityOffers = [], children }: ProductDetailSectionProps) {
  const { t } = useLocale();
  const [colorImageUrl, setColorImageUrl] = useState<string | null>(null);

  const totalStock = variants.reduce((sum, v) => sum + v.stockCount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-6">
      <ProductGallery
        images={images}
        productName={productName}
        overrideImageUrl={colorImageUrl}
      />
      <div className="space-y-5">
        {children}
        <AddToCartSection
          product={product}
          variants={variants}
          quantityOffers={quantityOffers}
          onVariantSelect={(v) => setColorImageUrl(v?.imageUrl ?? null)}
        />
        {totalStock > 0 ? (
          <p className="text-sm text-success font-medium">{t.product.inStock}</p>
        ) : (
          <p className="text-sm text-sale font-medium">{t.product.outOfStock}</p>
        )}
      </div>
    </div>
  );
}
