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
import { CartItemRow } from '../cart-item-row/cart-item-row';
import { cartDrawerTokens } from './cart-drawer.tokens';

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
        className={cartDrawerTokens.overlay}
        onClick={() => setCartDrawerOpen(false)}
        aria-hidden="true"
      />

      <div
        className={cartDrawerTokens.panel}
        role="dialog"
        aria-modal="true"
        aria-label={t.cart.title}
      >
        <div className={cartDrawerTokens.header}>
          <h2 className={cartDrawerTokens.title}>{t.cart.title}</h2>
          <button
            onClick={() => setCartDrawerOpen(false)}
            aria-label={t.cart.close}
            className={cartDrawerTokens.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={cartDrawerTokens.emptyState.wrapper}>
            <ShoppingBag className={cartDrawerTokens.emptyState.icon} />
            <p className={cartDrawerTokens.emptyState.title}>{t.cart.empty}</p>
            <p className={cartDrawerTokens.emptyState.sub}>{t.cart.emptySub}</p>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className={cartDrawerTokens.emptyState.startBtn}
            >
              {t.cart.startShopping}
            </button>
          </div>
        ) : (
          <>
            <div className={cartDrawerTokens.itemsList}>
              {items.map((item) => (
                <CartItemRow
                  key={`${item.productId}-${item.variantId ?? ''}-${item.addOnId ?? ''}`}
                  item={item}
                  variant="drawer"
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div className={cartDrawerTokens.footer}>
              <div className={cartDrawerTokens.subtotalRow}>
                <span className={cartDrawerTokens.subtotalLabel}>{t.cart.subtotal}</span>
                <span className={cartDrawerTokens.subtotalValue}>
                  {formatEgpSimple(totalEgp())}
                </span>
              </div>
              <p className={cartDrawerTokens.shippingNote}>{t.cart.shippingNote}</p>
              <button onClick={handleCheckout} className={cartDrawerTokens.checkoutBtn}>
                {t.cart.checkout}
              </button>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className={cartDrawerTokens.continueBtn}
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
