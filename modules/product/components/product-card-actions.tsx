'use client';

import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/modules/wishlist/wishlist.store';
import { useHasMounted } from '@/modules/_shared/hooks/use-has-mounted';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { productTokens } from '../product.tokens';

interface ProductCardActionsProps {
  product: {
    id: string;
    slug: string;
    name: string;
    nameAr?: string;
    brand: string;
    imageUrl: string;
    unitPriceEgp: number;
    stockCount: number;
  };
}

interface WishlistToggleProps {
  productId: string;
  name: string;
  brand: string;
  imageUrl: string;
  priceEgp: number;
  discountPercent?: number | null;
  slug: string;
}

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
      className={productTokens.cardActions.wishlistBtn}
    >
      <Heart
        className={isWishlisted ? productTokens.cardActions.wishlistIcon.active : productTokens.cardActions.wishlistIcon.inactive}
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
      className={productTokens.cardActions.quickAddBtn}
    >
      <ShoppingCart className="w-3.5 h-3.5" />
      {product.stockCount === 0 ? t.product.outOfStock : t.product.addToCart}
    </button>
  );
}
