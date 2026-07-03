'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { cloudinaryImageUrl } from '@/infrastructure/storage/cloudinary';
import { ProductGallery } from '@/modules/product/components/product-gallery';
import { PriceDisplay } from '@/modules/_shared/ui/price-display';
import { ProductSpecs } from '@/modules/product/components/product-specs';
import { useProductForm } from './product-form-provider';

export function ProductPreviewModal({ onClose }: { onClose: () => void }) {
  const { form, pendingFiles } = useProductForm();
  const { locale, t } = useLocale();
  const isAr = locale === 'ar';
  const v = form.watch();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const resolve = (url: string) =>
    url.startsWith('pending:') ? (pendingFiles.get(url)?.preview ?? '') : cloudinaryImageUrl(url);

  const name = (isAr && v.nameAr ? v.nameAr : v.name) || t.admin.preview;
  const description = isAr && v.descriptionAr ? v.descriptionAr : v.description;

  const images = [...(v.images ?? [])]
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)
    .map((img) => ({ url: resolve(img.url), alt: img.alt || name }))
    .filter((img) => img.url);

  const uniq = (key: 'color' | 'size') =>
    Array.from(new Set((v.variants ?? []).map((vt) => vt.attributes?.[key]).filter(Boolean))) as string[];
  const colors = uniq('color');
  const sizes = uniq('size');
  const totalStock = (v.variants ?? []).reduce((sum, vt) => sum + (Number(vt.stockCount) || 0), 0);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-bg-white dark:bg-bg-surface rounded-xl w-full max-w-4xl my-8 p-6 sm:p-8"
        dir={isAr ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 ltr:right-4 rtl:left-4 p-2 rounded-full text-text-secondary hover:bg-gray-100 dark:hover:bg-white/10"
          aria-label={t.admin.cancel}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery
            images={images.length ? images : [{ url: '/placeholder-product.jpg', alt: name }]}
            productName={name}
          />

          <div className="space-y-5">
            <div>
              {v.brand && <p className="text-sm font-medium text-text-secondary mb-1">{v.brand}</p>}
              <h1 className="text-detail-title font-semibold text-text-primary leading-tight">{name}</h1>
              {v.modelNumber && (
                <p className="text-sm text-text-secondary mt-1">
                  {t.product.model}: {v.modelNumber}
                </p>
              )}
            </div>

            <PriceDisplay priceEgp={Number(v.basePriceEgp) || 0} discountPercent={v.discountPercent} size="lg" />

            {colors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-text-secondary mb-2">{t.admin.colorAttr}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {colors.map((c) => (
                    <span
                      key={c}
                      title={c}
                      className="w-7 h-7 rounded-full border border-border-primary/30 shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div>
                <p className="text-sm font-medium text-text-secondary mb-2">{t.admin.sizeAttr}</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-tag border border-border-primary/30 text-sm text-text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(v.specs ?? []).length > 0 && <ProductSpecs specs={v.specs} locale={locale} />}

            <p className={`text-sm font-medium ${totalStock > 0 ? 'text-success' : 'text-sale'}`}>
              {totalStock > 0 ? t.product.inStock : t.product.outOfStock}
            </p>

            {description && (
              <section className="border-t border-border-primary/20 pt-4">
                <h2 className="text-newsletter-sub font-semibold text-text-primary mb-2">
                  {t.product.descriptionTab}
                </h2>
                <p className="text-base text-text-body leading-relaxed whitespace-pre-line">{description}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
