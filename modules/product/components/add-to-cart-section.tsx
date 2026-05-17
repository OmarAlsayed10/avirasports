'use client';

import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/modules/cart/cart.store';
import { useWishlistStore } from '@/modules/wishlist/wishlist.store';
import { useUIStore } from '@/modules/_shared/stores/ui.store';
import { useHasMounted } from '@/modules/_shared/hooks/use-has-mounted';
import { QuantitySelector } from './quantity-selector';
import { VariantSelector, type VariantOption } from './variant-selector';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { calcDiscountedPrice } from '@/modules/_shared/utils/calc-discounted-price';
import { productTokens } from '../product.tokens';

interface AddToCartSectionProps {
  product: {
    id: string;
    slug: string;
    name: string;
    nameAr?: string | null;
    brand: string;
    imageUrl: string;
    basePriceEgp: number;
    discountPercent: number | null;
  };
  variants: VariantOption[];
}

export function AddToCartSection({ product, variants }: AddToCartSectionProps) {
  const hasMounted = useHasMounted();
  const { t } = useLocale();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length === 1 ? variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null;
  const effectivePrice = selectedVariant?.priceOverrideEgp
    ? typeof selectedVariant.priceOverrideEgp === 'object'
      ? selectedVariant.priceOverrideEgp.toNumber()
      : Number(selectedVariant.priceOverrideEgp)
    : calcDiscountedPrice(product.basePriceEgp, product.discountPercent);

  const hasMultipleVariants = variants.length > 1;
  const needsSelection = hasMultipleVariants && !selectedVariantId;
  const stockCount = selectedVariant?.stockCount ?? variants.reduce((s, v) => s + v.stockCount, 0);
  const outOfStock = !needsSelection && stockCount === 0;

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem(
      {
        productId: product.id,
        variantId: selectedVariantId ?? undefined,
        name: product.name,
        nameAr: product.nameAr ?? undefined,
        brand: product.brand,
        imageUrl: product.imageUrl,
        unitPriceEgp: effectivePrice,
        stockCount,
        attributes: selectedVariant?.attributes ?? undefined,
        note: note.trim() || undefined,
      },
      quantity
    );
    setCartDrawerOpen(true);
    toast.success(t.product.addedToCart);
  };

  const handleWishlist = () => {
    toggleWishlist({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      imageUrl: product.imageUrl,
      priceEgp: product.basePriceEgp,
      discountPercent: product.discountPercent ?? undefined,
    });
    toast(isWishlisted ? t.wishlist.removeFromWishlist : t.wishlist.addToWishlist);
  };

  if (!hasMounted) {
    return (
      <div className={productTokens.detail.addToCartSkeleton}>
        <div className="h-10 bg-bg-page dark:bg-bg-surface rounded-stepper w-36" />
        <div className="h-12 bg-bg-page dark:bg-bg-surface rounded-btn-sm w-full" />
      </div>
    );
  }

  return (
    <div className={productTokens.detail.addToCartWrapper}>
      {variants.length > 1 && (
        <VariantSelector
          variants={variants}
          selectedId={selectedVariantId}
          onSelect={(id) => setSelectedVariantId(id)}
        />
      )}

      <QuantitySelector
        quantity={quantity}
        onChange={setQuantity}
        max={Math.min(stockCount, 99)}
      />

      <div>
        <label className={productTokens.detail.noteLabel}>{t.product.noteLabel}</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t.product.notePlaceholder}
          rows={2}
          maxLength={200}
          className={productTokens.detail.noteTextarea}
        />
      </div>

      <div className={productTokens.detail.actionsRow}>
        <button
          onClick={handleAddToCart}
          disabled={outOfStock || needsSelection}
          className={productTokens.detail.addToCartBtn}
          aria-label={needsSelection ? t.product.options : outOfStock ? t.product.outOfStock : t.product.addToCart}
        >
          <ShoppingCart className="w-5 h-5" />
          {needsSelection ? t.product.options : outOfStock ? t.product.outOfStock : t.product.addToCart}
        </button>

        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? t.wishlist.removeFromWishlist : t.wishlist.addToWishlist}
          aria-pressed={isWishlisted}
          className={productTokens.detail.wishlistBtn}
        >
          <Heart
            className={isWishlisted ? productTokens.detail.wishlistIcon.active : productTokens.detail.wishlistIcon.inactive}
          />
        </button>
      </div>

      {outOfStock && (
        <p className={productTokens.detail.outOfStockMsg}>
          {t.product.outOfStockMsg}
        </p>
      )}
    </div>
  );
}
