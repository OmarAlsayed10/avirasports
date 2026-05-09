'use client';

import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/stores/cart-store';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useHasMounted } from '@/lib/hooks/use-has-mounted';
import { QuantitySelector } from './quantity-selector';
import { VariantSelector, type VariantOption } from './variant-selector';
import { useLocale } from '@/lib/i18n/context';

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

  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null;
  const effectivePrice = selectedVariant?.priceOverrideEgp
    ? typeof selectedVariant.priceOverrideEgp === 'object'
      ? selectedVariant.priceOverrideEgp.toNumber()
      : Number(selectedVariant.priceOverrideEgp)
    : product.discountPercent
      ? Math.round(product.basePriceEgp * (1 - product.discountPercent / 100))
      : product.basePriceEgp;

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
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-bg-page dark:bg-bg-surface rounded-stepper w-36" />
        <div className="h-12 bg-bg-page dark:bg-bg-surface rounded-btn-sm w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={outOfStock || needsSelection}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-btn text-text-on-dark rounded-btn-sm text-nav-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary transition-colors"
          aria-label={needsSelection ? t.product.options : outOfStock ? t.product.outOfStock : t.product.addToCart}
        >
          <ShoppingCart className="w-5 h-5" />
          {needsSelection ? t.product.options : outOfStock ? t.product.outOfStock : t.product.addToCart}
        </button>

        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? t.wishlist.removeFromWishlist : t.wishlist.addToWishlist}
          aria-pressed={isWishlisted}
          className="flex items-center justify-center w-12 h-12 border border-border-primary/40 dark:border-white/20 rounded-btn-sm hover:border-primary transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${isWishlisted ? 'fill-sale text-sale' : 'text-text-primary dark:text-text-on-dark'}`}
          />
        </button>
      </div>

      {outOfStock && (
        <p className="text-nav-sm text-text-secondary">
          {t.product.outOfStockMsg}
        </p>
      )}
    </div>
  );
}
