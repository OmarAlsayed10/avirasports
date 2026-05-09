'use client';

import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/stores/cart-store';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useHasMounted } from '@/lib/hooks/use-has-mounted';
import { useLocale } from '@/lib/i18n/context';

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
      className="flex items-center justify-center w-8 h-8 rounded-full bg-bg-white/90 dark:bg-bg-surface/90 hover:bg-bg-white dark:hover:bg-bg-surface shadow-sm transition-colors"
    >
      <Heart
        className={`w-4 h-4 ${isWishlisted ? 'fill-sale text-sale' : 'text-text-primary dark:text-text-on-dark'}`}
      />
    </button>
  );
}

export function QuickAddButton({ product }: ProductCardActionsProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const { t } = useLocale();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stockCount === 0) return;
    addItem({
      productId: product.id,
      name: product.name,
      nameAr: product.nameAr,
      brand: product.brand,
      imageUrl: product.imageUrl,
      unitPriceEgp: product.unitPriceEgp,
      stockCount: product.stockCount,
    });
    setCartDrawerOpen(true);
    toast.success(t.product.addedToCart);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={product.stockCount === 0}
      aria-label={product.stockCount === 0 ? t.product.outOfStock : t.product.addToCart}
      className="flex items-center justify-center gap-1.5 w-full py-2 bg-primary-btn text-text-on-dark rounded-btn-sm text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary transition-colors"
    >
      <ShoppingCart className="w-3.5 h-3.5" />
      {product.stockCount === 0 ? t.product.outOfStock : t.product.addToCart}
    </button>
  );
}
