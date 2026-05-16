'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlistStore, type WishlistItem } from '@/modules/wishlist/wishlist.store';
import { useCartStore } from '@/modules/cart/cart.store';
import { useHasMounted } from '@/modules/_shared/hooks/use-has-mounted';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { formatEgpSimple } from '@/modules/_shared/utils/format-egp';
import { toast } from 'sonner';
import { wishlistTokens } from '../wishlist.tokens';

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
    <div className={wishlistTokens.row.wrapper}>
      <Link
        href={`/product/${item.slug}`}
        onClick={onClose}
        className={wishlistTokens.row.imageLink}
      >
        <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1.5" sizes="64px" />
        {item.discountPercent && (
          <span className={wishlistTokens.row.discountBadge}>
            -{item.discountPercent}%
          </span>
        )}
      </Link>

      <div className={wishlistTokens.row.body}>
        <div>
          <p className={wishlistTokens.row.brand}>{item.brand}</p>
          <Link
            href={`/product/${item.slug}`}
            onClick={onClose}
            className={wishlistTokens.row.nameLink}
          >
            {item.name}
          </Link>
          <div className={wishlistTokens.row.priceRow}>
            <span className={wishlistTokens.row.price}>
              {formatEgpSimple(finalPrice)}
            </span>
            {item.discountPercent && (
              <span className={wishlistTokens.row.originalPrice}>
                {formatEgpSimple(item.priceEgp)}
              </span>
            )}
          </div>
        </div>

        <div className={wishlistTokens.row.controls}>
          <button onClick={handleMoveToCart} className={wishlistTokens.row.moveToCartBtn}>
            <ShoppingCart className="w-3 h-3" aria-hidden="true" />
            {t.wishlist.moveToCart}
          </button>
          <button
            onClick={() => removeItem(item.productId)}
            className={wishlistTokens.row.removeBtn}
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
    <div ref={ref} className={wishlistTokens.icon.wrapper}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={wishlistTokens.icon.btn}
        aria-label={itemCount > 0 ? t.wishlist.openWishlist(itemCount) : t.nav.wishlist}
      >
        <Heart className="w-6 h-6 text-text-primary dark:text-text-on-dark" />
        {itemCount > 0 && (
          <span className={wishlistTokens.icon.badge}>
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>

      {open && (
        <div className={wishlistTokens.icon.dropdown}>
          <div className={wishlistTokens.icon.dropdownHeader}>
            <h2 className={wishlistTokens.icon.dropdownTitle}>
              {t.wishlist.title}
              {itemCount > 0 && (
                <span className="ml-1 text-text-secondary dark:text-text-footer-link font-normal">
                  ({itemCount})
                </span>
              )}
            </h2>
          </div>

          {!hasMounted || items.length === 0 ? (
            <div className={wishlistTokens.emptyState.wrapper}>
              <Heart className={wishlistTokens.emptyState.icon} />
              <p className={wishlistTokens.emptyState.title}>{t.wishlist.empty}</p>
              <p className={wishlistTokens.emptyState.sub}>{t.wishlist.emptySub}</p>
              <button onClick={close} className={wishlistTokens.emptyState.continueBtn}>
                {t.wishlist.continueShopping}
              </button>
            </div>
          ) : (
            <>
              <div className={wishlistTokens.icon.dropdownItems}>
                {items.map((item) => (
                  <WishlistRow key={item.productId} item={item} onClose={close} />
                ))}
              </div>

              <div className={wishlistTokens.icon.dropdownFooter}>
                <button onClick={close} className={wishlistTokens.icon.continueBtn}>
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
