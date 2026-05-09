'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { X, ShoppingBag } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/stores/cart-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useHasMounted } from '@/lib/hooks/use-has-mounted';
import { useLocale } from '@/lib/i18n/context';
import { formatEgpSimple } from '@/lib/utils/format-egp';
import { CartItemRow } from './cart-item-row';

export function CartDrawer() {
  const hasMounted = useHasMounted();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { cartDrawerOpen, setCartDrawerOpen } = useUIStore();
  const { items, removeItem, updateQuantity, totalEgp } = useCartStore();
  const { t } = useLocale();

  const handleCheckout = () => {
    setCartDrawerOpen(false);
    router.push(session ? '/checkout' : '/login?callbackUrl=/checkout');
  };

  useEffect(() => {
    setCartDrawerOpen(false);
  }, [pathname, setCartDrawerOpen]);

  useEffect(() => {
    if (cartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [cartDrawerOpen]);

  if (!hasMounted || !cartDrawerOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[52] bg-black/50"
        onClick={() => setCartDrawerOpen(false)}
        aria-hidden="true"
      />

      <div
        className="fixed top-0 right-0 z-[55] h-full w-full max-w-md bg-bg-white dark:bg-bg-surface shadow-xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={t.cart.title}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary/20 dark:border-white/10">
          <h2 className="text-newsletter-sub font-semibold text-text-primary dark:text-text-on-dark">{t.cart.title}</h2>
          <button
            onClick={() => setCartDrawerOpen(false)}
            aria-label={t.cart.close}
            className="p-1 text-text-primary dark:text-text-on-dark hover:text-primary-btn transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-12">
            <ShoppingBag className="w-16 h-16 text-text-placeholder dark:text-text-footer-link" />
            <p className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark">{t.cart.empty}</p>
            <p className="text-nav-sm text-text-secondary dark:text-text-footer-link text-center">{t.cart.emptySub}</p>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="px-6 py-3 bg-primary-btn text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary transition-colors"
            >
              {t.cart.startShopping}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <CartItemRow
                  key={`${item.productId}-${item.variantId ?? ''}`}
                  item={item}
                  variant="drawer"
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div className="border-t border-border-primary/20 dark:border-white/10 px-6 py-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-nav-sm font-medium text-text-primary dark:text-text-on-dark">{t.cart.subtotal}</span>
                <span className="text-newsletter-sub font-semibold text-text-primary dark:text-text-on-dark">
                  {formatEgpSimple(totalEgp())}
                </span>
              </div>
              <p className="text-xs text-text-secondary dark:text-text-footer-link">{t.cart.shippingNote}</p>
              <button
                onClick={handleCheckout}
                className="block w-full py-3 bg-primary-btn text-text-on-dark rounded-btn-sm text-nav-sm font-semibold text-center hover:bg-primary transition-colors"
              >
                {t.cart.checkout}
              </button>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="block w-full text-center text-nav-sm font-medium text-text-primary dark:text-text-on-dark hover:text-primary-btn dark:hover:text-primary-btn transition-colors"
              >
                {t.cart.continueShopping}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
