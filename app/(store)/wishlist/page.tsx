'use client';

import { useHasMounted } from '@/modules/_shared/hooks/use-has-mounted';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { useWishlistStore, type WishlistItem } from '@/modules/wishlist/wishlist.store';
import { useCartStore } from '@/modules/cart/cart.store';
import { useUIStore } from '@/modules/_shared/stores/ui.store';
import { formatEgp } from '@/modules/_shared/utils/format-egp';
import { toast } from 'sonner';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';

function WishlistCard({ item }: { item: WishlistItem }) {
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const { t } = useLocale();

  const finalPrice = item.discountPercent
    ? Math.round(item.priceEgp * (1 - item.discountPercent / 100))
    : item.priceEgp;

  const handleMoveToCart = () => {
    addItem({
      productId: item.productId,
      name: item.name,
      brand: item.brand,
      imageUrl: item.imageUrl,
      unitPriceEgp: finalPrice,
    });
    removeItem(item.productId);
    setCartDrawerOpen(true);
    toast.success(t.product.addedToCart);
  };

  return (
    <article className="bg-bg-white rounded-carousel border border-border-primary/10 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/product/${item.slug}`} className="block">
        <div className="relative aspect-square bg-bg-page overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {item.discountPercent && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-sale text-text-on-dark text-xs font-semibold rounded-tag">
              -{item.discountPercent}%
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-text-secondary font-medium mb-1">{item.brand}</p>
          <h3 className="text-card font-semibold text-text-primary leading-tight line-clamp-2 mb-2">
            {item.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-nav-sm font-semibold text-text-primary">
              {formatEgp(finalPrice)}
            </span>
            {item.discountPercent && (
              <span className="text-xs text-text-secondary line-through">
                {formatEgp(item.priceEgp)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={handleMoveToCart}
          className="flex-1 flex items-center justify-center gap-2 h-10 bg-primary text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" aria-hidden="true" />
          {t.wishlist.moveToCart}
        </button>
        <button
          onClick={() => removeItem(item.productId)}
          className="w-10 h-10 flex items-center justify-center border border-border-primary/40 rounded-btn-sm text-text-secondary hover:text-sale hover:border-sale transition-colors"
          aria-label={t.wishlist.remove(item.name)}
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export default function WishlistPage() {
  const hasMounted = useHasMounted();
  const items = useWishlistStore((s) => s.items);
  const { t } = useLocale();

  if (!hasMounted) {
    return (
      <div className="max-w-content mx-auto px-site py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-bg-white rounded-carousel border border-border-primary/10 aspect-square animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-site py-12">
      <h1 className="text-section-heading font-semibold text-text-primary mb-8">
        {t.wishlist.title} {items.length > 0 && <span className="text-text-secondary font-normal text-nav-sm">{t.wishlist.items(items.length)}</span>}
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="w-16 h-16 text-primary/20 mb-4" aria-hidden="true" />
          <h2 className="text-section-heading font-semibold text-text-primary mb-2">
            {t.wishlist.empty}
          </h2>
          <p className="text-nav-sm text-text-secondary mb-6 max-w-sm">
            {t.wishlist.emptySub}
          </p>
          <Link
            href="/shop"
            className="px-6 py-3 bg-primary text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            {t.wishlist.continueShopping}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <WishlistCard key={item.productId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
