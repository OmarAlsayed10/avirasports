'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart-store';
import { useHasMounted } from '@/lib/hooks/use-has-mounted';
import { formatEgpSimple } from '@/lib/utils/format-egp';
import { CartItemRow } from './cart-item-row';
import { useLocale } from '@/lib/i18n/context';

export function CartIcon() {
  const hasMounted = useHasMounted();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const { items, removeItem, updateQuantity, totalEgp } = useCartStore();

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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative"
        aria-label={hasMounted && itemCount > 0 ? t.cart.openCart(itemCount) : t.cart.title}
      >
        <ShoppingCart className="w-6 h-6 text-text-primary dark:text-text-on-dark" />
        {hasMounted && itemCount > 0 && (
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
              {t.cart.title}
              {hasMounted && itemCount > 0 && (
                <span className="ml-1 text-text-secondary dark:text-text-footer-link font-normal">({itemCount})</span>
              )}
            </h2>
          </div>

          {/* Empty state */}
          {!hasMounted || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-8">
              <ShoppingBag className="w-12 h-12 text-text-placeholder" />
              <p className="text-sm font-semibold text-text-primary dark:text-text-on-dark">{t.cart.empty}</p>
              <p className="text-xs text-text-secondary dark:text-text-footer-link text-center">
                {t.cart.emptySub}
              </p>
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2 bg-primary-btn text-bg-dark rounded-btn-sm text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {t.cart.startShopping}
              </button>
            </div>
          ) : (
            <>
              {/* Items list */}
              <div className="overflow-y-auto flex-1 px-4 py-3 space-y-3">
                {items.map((item) => (
                  <CartItemRow
                    key={`${item.productId}-${item.variantId ?? ''}`}
                    item={item}
                    variant="dropdown"
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-border-primary/10 dark:border-white/10 px-4 py-3 space-y-2 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-text-primary dark:text-text-on-dark">{t.cart.subtotal}</span>
                  <span className="text-sm font-semibold text-text-primary dark:text-text-on-dark">
                    {formatEgpSimple(totalEgp())}
                  </span>
                </div>
                <p className="text-xs text-text-secondary dark:text-text-footer-link">
                  {t.cart.shippingNote}
                </p>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="block w-full py-2.5 bg-primary-btn text-bg-dark rounded-btn-sm text-sm font-semibold text-center hover:opacity-90 transition-opacity"
                >
                  {t.cart.checkout}
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="block w-full text-center text-xs font-medium text-text-primary dark:text-text-on-dark hover:text-primary-btn transition-colors"
                >
                  {t.cart.continueShopping}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CartIcon;
