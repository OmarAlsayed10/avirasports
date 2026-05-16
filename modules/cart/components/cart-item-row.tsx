'use client';

import Image from 'next/image';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatEgpSimple } from '@/modules/_shared/utils/format-egp';
import type { CartItem } from '@/modules/cart/cart.store';
import { cartTokens } from '../cart.tokens';

interface CartItemRowProps {
  item: CartItem;
  variant: 'drawer' | 'dropdown';
  onUpdateQuantity: (productId: string, qty: number, variantId?: string) => void;
  onRemove: (productId: string, variantId?: string) => void;
}

function CartItemAttributes({ attributes }: { attributes?: Record<string, string> }) {
  if (!attributes || Object.keys(attributes).length === 0) return null;
  return (
    <div className={cartTokens.itemAttributes.wrapper}>
      {Object.entries(attributes).map(([key, value]) =>
        key.toLowerCase() === 'color' ? (
          <span
            key={key}
            className={cartTokens.itemAttributes.colorCircle}
            style={{ backgroundColor: value }}
            title={value}
            aria-label={`Color: ${value}`}
          />
        ) : (
          <span key={key} className={cartTokens.itemAttributes.text}>
            {value}
          </span>
        )
      )}
    </div>
  );
}

export function CartItemRow({ item, variant, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const isDrawer = variant === 'drawer';
  const t = isDrawer ? cartTokens.item.drawer : cartTokens.item.dropdown;
  const imgPx = isDrawer ? 64 : 56;

  return (
    <div className="flex gap-3">
      <div className={`relative ${isDrawer ? 'w-16 h-16' : 'w-14 h-14'} flex-shrink-0 bg-bg-page dark:bg-bg-dark rounded-tag overflow-hidden`}>
        <Image
          src={item.imageUrl || '/placeholder-product.jpg'}
          alt={item.name}
          fill
          className="object-contain p-1"
          sizes={`${imgPx}px`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`${t.name} line-clamp-2 leading-tight`}>{item.name}</p>
        <CartItemAttributes attributes={item.attributes} />
        <p className="text-xs text-text-secondary dark:text-text-footer-link mt-0.5">
          {formatEgpSimple(item.unitPriceEgp)}
        </p>
        <div className={`flex items-center justify-between ${t.controls}`}>
          <div className={cartTokens.item.drawer.stepper}>
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1, item.variantId)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className={t.stepperBtn}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className={t.stepperQty}>{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1, item.variantId)}
              aria-label="Increase quantity"
              className={t.stepperBtn}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <button
            onClick={() => onRemove(item.productId, item.variantId)}
            aria-label={`Remove ${item.name} from cart`}
            className={cartTokens.item.drawer.removeBtn}
          >
            <Trash2 className={isDrawer ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          </button>
        </div>
      </div>
      <p className={t.totalPrice}>{formatEgpSimple(item.unitPriceEgp * item.quantity)}</p>
    </div>
  );
}
