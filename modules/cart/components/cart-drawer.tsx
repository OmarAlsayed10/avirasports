'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { X, ShoppingBag } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/modules/cart/cart.store';
import { useUIStore } from '@/modules/_shared/stores/ui.store';
import { useHasMounted } from '@/modules/_shared/hooks/use-has-mounted';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { formatEgpSimple } from '@/modules/_shared/utils/format-egp';
import { CartItemRow } from './cart-item-row';
import { cartTokens } from '../cart.tokens';

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
        className={cartTokens.drawer.overlay}
        onClick={() => setCartDrawerOpen(false)}
        aria-hidden="true"
      />

      <div
        className={cartTokens.drawer.panel}
        role="dialog"
        aria-modal="true"
        aria-label={t.cart.title}
      >
        <div className={cartTokens.drawer.header}>
          <h2 className={cartTokens.drawer.title}>{t.cart.title}</h2>
          <button
            onClick={() => setCartDrawerOpen(false)}
            aria-label={t.cart.close}
            className={cartTokens.drawer.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={cartTokens.emptyState.wrapper}>
            <ShoppingBag className={cartTokens.emptyState.icon} />
            <p className={cartTokens.emptyState.title}>{t.cart.empty}</p>
            <p className={cartTokens.emptyState.sub}>{t.cart.emptySub}</p>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className={cartTokens.emptyState.startBtn}
            >
              {t.cart.startShopping}
            </button>
          </div>
        ) : (
          <>
            <div className={cartTokens.drawer.itemsList}>
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

            <div className={cartTokens.drawer.footer}>
              <div className={cartTokens.drawer.subtotalRow}>
                <span className={cartTokens.drawer.subtotalLabel}>{t.cart.subtotal}</span>
                <span className={cartTokens.drawer.subtotalValue}>
                  {formatEgpSimple(totalEgp())}
                </span>
              </div>
              <p className={cartTokens.drawer.shippingNote}>{t.cart.shippingNote}</p>
              <button onClick={handleCheckout} className={cartTokens.drawer.checkoutBtn}>
                {t.cart.checkout}
              </button>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className={cartTokens.drawer.continueBtn}
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
