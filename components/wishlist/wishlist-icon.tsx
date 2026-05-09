'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlistStore, type WishlistItem } from '@/lib/stores/wishlist-store';
import { useCartStore } from '@/lib/stores/cart-store';
import { useHasMounted } from '@/lib/hooks/use-has-mounted';
import { useLocale } from '@/lib/i18n/context';
import { formatEgpSimple } from '@/lib/utils/format-egp';
import { toast } from 'sonner';

function WishlistRow({ item, onClose }: { item: WishlistItem; onClose: () => void }) {
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addItem = useCartStore((s) => s.addItem);
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
    onClose();
    toast.success(t.product.addedToCart);
  };

  return (
    <div className="flex gap-3 py-3 border-b border-border-primary/10 dark:border-white/10 last:border-0">
      <Link
        href={`/product/${item.slug}`}
        onClick={onClose}
        className="relative w-16 h-16 flex-shrink-0 bg-bg-page dark:bg-bg-dark rounded-tag overflow-hidden"
      >
        <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1.5" sizes="64px" />
        {item.discountPercent && (
          <span className="absolute top-0.5 left-0.5 px-1 py-0.5 bg-sale text-white text-[9px] font-semibold rounded leading-none">
            -{item.discountPercent}%
          </span>
        )}
      </Link>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-xs text-text-secondary dark:text-text-footer-link">{item.brand}</p>
          <Link
            href={`/product/${item.slug}`}
            onClick={onClose}
            className="text-sm font-medium text-text-primary dark:text-text-on-dark line-clamp-2 leading-tight hover:text-primary-btn transition-colors"
          >
            {item.name}
          </Link>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-semibold text-text-primary dark:text-text-on-dark">
              {formatEgpSimple(finalPrice)}
            </span>
            {item.discountPercent && (
              <span className="text-xs text-text-secondary dark:text-text-footer-link line-through">
                {formatEgpSimple(item.priceEgp)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1.5">
          <button
            onClick={handleMoveToCart}
            className="flex items-center gap-1 px-2.5 py-1 bg-primary text-text-on-dark rounded-btn-sm text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            <ShoppingCart className="w-3 h-3" aria-hidden="true" />
            {t.wishlist.moveToCart}
          </button>
          <button
            onClick={() => removeItem(item.productId)}
            className="w-7 h-7 flex items-center justify-center border border-border-primary/30 dark:border-white/10 rounded-btn-sm text-text-secondary hover:text-sale hover:border-sale transition-colors"
            aria-label={t.wishlist.remove(item.name)}
          >
            <Trash2 className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function WishlistIcon() {
  const hasMounted = useHasMounted();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const items = useWishlistStore((s) => s.items);
  const itemCount = hasMounted ? items.length : 0;

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = () => setOpen(false);

  return (
    <div ref={ref} className="relative hidden md:flex">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative"
        aria-label={itemCount > 0 ? t.wishlist.openWishlist(itemCount) : t.nav.wishlist}
      >
        <Heart className="w-6 h-6 text-text-primary dark:text-text-on-dark" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-primary-btn rounded-full flex items-center justify-center text-xs font-medium text-bg-dark">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-bg-white dark:bg-bg-surface rounded-card-lg shadow-newsletter border border-border-primary/10 dark:border-white/10 z-50 flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center px-4 py-3 border-b border-border-primary/10 dark:border-white/10 flex-shrink-0">
            <h2 className="text-sm font-semibold text-text-primary dark:text-text-on-dark">
              {t.wishlist.title}
              {itemCount > 0 && (
                <span className="ml-1 text-text-secondary dark:text-text-footer-link font-normal">
                  ({itemCount})
                </span>
              )}
            </h2>
          </div>

          {/* Empty state */}
          {!hasMounted || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-8">
              <Heart className="w-10 h-10 text-text-placeholder" />
              <p className="text-sm font-semibold text-text-primary dark:text-text-on-dark">{t.wishlist.empty}</p>
              <p className="text-xs text-text-secondary dark:text-text-footer-link text-center">{t.wishlist.emptySub}</p>
              <button
                onClick={close}
                className="px-5 py-2 bg-primary-btn text-bg-dark rounded-btn-sm text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {t.wishlist.continueShopping}
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-y-auto flex-1 px-4">
                {items.map((item) => (
                  <WishlistRow key={item.productId} item={item} onClose={close} />
                ))}
              </div>

              <div className="border-t border-border-primary/10 dark:border-white/10 px-4 py-3 flex-shrink-0">
                <button
                  onClick={close}
                  className="block w-full text-center text-xs font-medium text-text-primary dark:text-text-on-dark hover:text-primary-btn transition-colors"
                >
                  {t.wishlist.continueShopping}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default WishlistIcon;
