'use client';

import Link from 'next/link';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/modules/cart/cart.store';
import { useHasMounted } from '@/modules/_shared/hooks/use-has-mounted';
import { useDropdown } from '@/modules/_shared/hooks/use-dropdown';
import { formatEgpSimple } from '@/modules/_shared/utils/format-egp';
import { CartItemRow } from './cart-item-row';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { cartTokens } from '../cart.tokens';

export function CartIcon() {
  const hasMounted = useHasMounted();
  const { t } = useLocale();
  const { open, setOpen, ref } = useDropdown();
  const itemCount = useCartStore((s) => s.itemCount());
  const { items, removeItem, updateQuantity, totalEgp } = useCartStore();

  const ariaLabel = hasMounted && itemCount > 0 ? t.cart.openCart(itemCount) : t.cart.title;

  return (
    <>
      <Link href="/cart" className={cartTokens.icon.mobileLink} aria-label={ariaLabel}>
        <ShoppingCart className={cartTokens.icon.cartIcon} />
        {hasMounted && itemCount > 0 && (
          <span className={cartTokens.icon.badge}>{itemCount > 9 ? '9+' : itemCount}</span>
        )}
      </Link>

      <div ref={ref} className={cartTokens.icon.desktopWrapper}>
        <button onClick={() => setOpen((o) => !o)} className={cartTokens.icon.btn} aria-label={ariaLabel}>
          <ShoppingCart className={cartTokens.icon.cartIcon} />
          {hasMounted && itemCount > 0 && (
            <span className={cartTokens.icon.badge}>{itemCount > 9 ? '9+' : itemCount}</span>
          )}
        </button>

        {open && (
          <div className={cartTokens.icon.dropdown}>
            <div className={cartTokens.icon.dropdownHeader}>
              <h2 className={cartTokens.icon.dropdownTitle}>
                {t.cart.title}
                {hasMounted && itemCount > 0 && (
                  <span className={cartTokens.icon.dropdownItemCount}>({itemCount})</span>
                )}
              </h2>
            </div>

            {!hasMounted || items.length === 0 ? (
              <div className={cartTokens.icon.dropdownEmptyWrapper}>
                <ShoppingBag className={cartTokens.icon.dropdownEmptyIcon} />
                <p className={cartTokens.icon.dropdownEmptyTitle}>{t.cart.empty}</p>
                <p className={cartTokens.icon.dropdownEmptySub}>{t.cart.emptySub}</p>
                <button onClick={() => setOpen(false)} className={cartTokens.icon.dropdownEmptyBtn}>
                  {t.cart.startShopping}
                </button>
              </div>
            ) : (
              <>
                <div className={cartTokens.icon.dropdownItems}>
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

                <div className={cartTokens.icon.dropdownFooter}>
                  <div className={cartTokens.icon.dropdownSubtotalRow}>
                    <span className={cartTokens.icon.dropdownSubtotalLabel}>{t.cart.subtotal}</span>
                    <span className={cartTokens.icon.dropdownSubtotalValue}>{formatEgpSimple(totalEgp())}</span>
                  </div>
                  <p className={cartTokens.drawer.shippingNote}>{t.cart.shippingNote}</p>
                  <Link href="/checkout" onClick={() => setOpen(false)} className={cartTokens.icon.dropdownCheckoutBtn}>
                    {t.cart.checkout}
                  </Link>
                  <button onClick={() => setOpen(false)} className={cartTokens.icon.dropdownContinueBtn}>
                    {t.cart.continueShopping}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default CartIcon;
