'use client';

import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/modules/wishlist/wishlist.store';
import { useHasMounted } from '@/modules/_shared/hooks/use-has-mounted';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { productCardActionsTokens } from './product-card-actions.tokens';
import type { ProductCardActionsProps, WishlistToggleProps } from './product-card-actions.types';

export type { ProductCardActionsProps, WishlistToggleProps };

export function WishlistToggle({ productId, name, brand, imageUrl, priceEgp, discountPercent, slug }: WishlistToggleProps) {
  const hasMounted = useHasMounted();
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(productId));
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const { t } = useLocale();

  if (!hasMounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggleItem({ productId, name, brand, imageUrl, priceEgp, discountPercent: discountPercent ?? undefined, slug });
        toast(isWishlisted ? t.wishlist.removeFromWishlist : t.wishlist.addToWishlist);
      }}
      aria-label={isWishlisted ? t.wishlist.removeFromWishlist : t.wishlist.addToWishlist}
      className={productCardActionsTokens.wishlistBtn}
    >
      <Heart
        className={isWishlisted ? productCardActionsTokens.wishlistIcon.active : productCardActionsTokens.wishlistIcon.inactive}
      />
    </button>
  );
}

export function QuickAddButton({ product }: ProductCardActionsProps) {
  const router = useRouter();
  const { t } = useLocale();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/product/${product.slug}`);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={product.stockCount === 0}
      aria-label={product.stockCount === 0 ? t.product.outOfStock : t.product.addToCart}
      className={productCardActionsTokens.quickAddBtn}
    >
      <ShoppingCart className="w-3.5 h-3.5" />
      {product.stockCount === 0 ? t.product.outOfStock : t.product.addToCart}
    </button>
  );
}
