'use client';

import Link from 'next/link';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/modules/cart/cart.store';
import { useHasMounted } from '@/modules/_shared/hooks/use-has-mounted';
import { useDropdown } from '@/modules/_shared/hooks/use-dropdown';
import { formatEgpSimple } from '@/modules/_shared/utils/format-egp';
import { CartItemRow } from '../cart-item-row/cart-item-row';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { cartIconTokens } from './cart-icon.tokens';

export function CartIcon() {
  const hasMounted = useHasMounted();
  const { t } = useLocale();
  const { open, setOpen, ref } = useDropdown();
  const itemCount = useCartStore((s) => s.itemCount());
  const { items, removeItem, updateQuantity, totalEgp } = useCartStore();

  const ariaLabel = hasMounted && itemCount > 0 ? t.cart.openCart(itemCount) : t.cart.title;

  return (
    <>
      <Link href="/cart" className={cartIconTokens.mobileLink} aria-label={ariaLabel}>
        <ShoppingCart className={cartIconTokens.cartIcon} />
        {hasMounted && itemCount > 0 && (
          <span className={cartIconTokens.badge}>{itemCount > 9 ? '9+' : itemCount}</span>
        )}
      </Link>

      <div ref={ref} className={cartIconTokens.desktopWrapper}>
        <button onClick={() => setOpen((o) => !o)} className={cartIconTokens.btn} aria-label={ariaLabel}>
          <ShoppingCart className={cartIconTokens.cartIcon} />
          {hasMounted && itemCount > 0 && (
            <span className={cartIconTokens.badge}>{itemCount > 9 ? '9+' : itemCount}</span>
          )}
        </button>

        {open && (
          <div className={cartIconTokens.dropdown}>
            <div className={cartIconTokens.dropdownHeader}>
              <h2 className={cartIconTokens.dropdownTitle}>
                {t.cart.title}
                {hasMounted && itemCount > 0 && (
                  <span className={cartIconTokens.dropdownItemCount}>({itemCount})</span>
                )}
              </h2>
            </div>

            {!hasMounted || items.length === 0 ? (
              <div className={cartIconTokens.dropdownEmptyWrapper}>
                <ShoppingBag className={cartIconTokens.dropdownEmptyIcon} />
                <p className={cartIconTokens.dropdownEmptyTitle}>{t.cart.empty}</p>
                <p className={cartIconTokens.dropdownEmptySub}>{t.cart.emptySub}</p>
                <button onClick={() => setOpen(false)} className={cartIconTokens.dropdownEmptyBtn}>
                  {t.cart.startShopping}
                </button>
              </div>
            ) : (
              <>
                <div className={cartIconTokens.dropdownItems}>
                  {items.map((item) => (
                    <CartItemRow
                      key={`${item.productId}-${item.variantId ?? ''}-${item.addOnId ?? ''}`}
                      item={item}
                      variant="dropdown"
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>

                <div className={cartIconTokens.dropdownFooter}>
                  <div className={cartIconTokens.dropdownSubtotalRow}>
                    <span className={cartIconTokens.dropdownSubtotalLabel}>{t.cart.subtotal}</span>
                    <span className={cartIconTokens.dropdownSubtotalValue}>{formatEgpSimple(totalEgp())}</span>
                  </div>
                  <p className={cartIconTokens.dropdownShippingNote}>{t.cart.shippingNote}</p>
                  <Link href="/checkout" onClick={() => setOpen(false)} className={cartIconTokens.dropdownCheckoutBtn}>
                    {t.cart.checkout}
                  </Link>
                  <button onClick={() => setOpen(false)} className={cartIconTokens.dropdownContinueBtn}>
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
