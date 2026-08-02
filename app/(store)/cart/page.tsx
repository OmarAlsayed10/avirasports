'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/modules/cart/cart.store';
import { useHasMounted } from '@/modules/_shared/hooks/use-has-mounted';
import { CartItemRow } from '@/modules/cart/components/cart-item-row';
import { formatEgp } from '@/modules/_shared/utils/format-egp';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { cartTokens as tk } from '@/modules/cart/cart.tokens';

export default function CartPage() {
  const hasMounted = useHasMounted();
  const { items, removeItem, updateQuantity, totalEgp } = useCartStore();
  const itemCount = useCartStore((s) => s.itemCount());
  const { t } = useLocale();

  if (!hasMounted) {
    return (
      <div className={tk.page.root}>
        <div className={tk.page.skeleton.list}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={tk.page.skeleton.item} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={tk.page.root}>
      <h1 className={tk.page.heading}>
        {t.cart.title}
        {items.length > 0 && (
          <span className={tk.page.itemCount}>({itemCount})</span>
        )}
      </h1>

      {items.length === 0 ? (
        <div className={tk.page.emptyWrapper}>
          <ShoppingBag className={tk.page.emptyIcon} aria-hidden="true" />
          <h2 className={tk.page.emptyTitle}>{t.cart.empty}</h2>
          <p className={tk.page.emptySub}>{t.cart.emptySub}</p>
          <Link href="/shop" className={tk.page.emptyBtn}>
            {t.cart.startShopping}
          </Link>
        </div>
      ) : (
        <div className={tk.page.list}>
          <div className={tk.page.itemsCard}>
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId ?? ''}-${item.addOnId ?? ''}`} className={tk.page.itemPadding}>
                <CartItemRow
                  item={item}
                  variant="drawer"
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              </div>
            ))}
          </div>

          <div className={tk.page.summaryCard}>
            <div className={tk.page.subtotalRow}>
              <span className={tk.page.subtotalLabel}>{t.cart.subtotal}</span>
              <span className={tk.page.subtotalValue}>{formatEgp(totalEgp())}</span>
            </div>
            <p className={tk.page.shippingNote}>{t.cart.shippingNote}</p>
            <Link href="/checkout" className={tk.page.checkoutBtn}>
              {t.cart.checkout}
            </Link>
            <Link href="/shop" className={tk.page.continueBtn}>
              {t.cart.continueShopping}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
