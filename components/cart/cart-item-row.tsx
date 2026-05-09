'use client';

import Image from 'next/image';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatEgpSimple } from '@/lib/utils/format-egp';
import type { CartItem } from '@/lib/stores/cart-store';

interface CartItemRowProps {
  item: CartItem;
  variant: 'drawer' | 'dropdown';
  onUpdateQuantity: (productId: string, qty: number, variantId?: string) => void;
  onRemove: (productId: string, variantId?: string) => void;
}

export function CartItemRow({ item, variant, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const isDrawer = variant === 'drawer';

  const imgSize = isDrawer ? 'w-16 h-16' : 'w-14 h-14';
  const imgPx = isDrawer ? 64 : 56;
  const nameText = isDrawer ? 'text-nav-sm' : 'text-xs';
  const totalText = isDrawer ? 'text-nav-sm' : 'text-xs';
  const btnSize = isDrawer ? 'w-7 h-7' : 'w-6 h-6';
  const qtyWidth = isDrawer ? 'w-8' : 'w-6';
  const trashSize = isDrawer ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const mt = isDrawer ? 'mt-2' : 'mt-1.5';

  return (
    <div className="flex gap-3">
      <div className={`relative ${imgSize} flex-shrink-0 bg-bg-page dark:bg-bg-dark rounded-tag overflow-hidden`}>
        <Image
          src={item.imageUrl || '/placeholder-product.jpg'}
          alt={item.name}
          fill
          className="object-contain p-1"
          sizes={`${imgPx}px`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`${nameText} font-medium text-text-primary dark:text-text-on-dark line-clamp-2 leading-tight`}>
          {item.name}
        </p>
        <p className="text-xs text-text-secondary dark:text-text-footer-link mt-0.5">
          {formatEgpSimple(item.unitPriceEgp)}
        </p>
        <div className={`flex items-center justify-between ${mt}`}>
          <div className="flex items-center border border-border-primary/30 dark:border-white/10 rounded-full overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1, item.variantId)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className={`${btnSize} flex items-center justify-center text-text-primary dark:text-text-on-dark disabled:opacity-40 hover:bg-bg-page dark:hover:bg-bg-dark transition-colors`}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className={`${qtyWidth} text-center text-xs font-semibold text-text-primary dark:text-text-on-dark`}>
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1, item.variantId)}
              aria-label="Increase quantity"
              className={`${btnSize} flex items-center justify-center text-text-primary dark:text-text-on-dark hover:bg-bg-page dark:hover:bg-bg-dark transition-colors`}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <button
            onClick={() => onRemove(item.productId, item.variantId)}
            aria-label={`Remove ${item.name} from cart`}
            className="text-text-placeholder dark:text-text-footer-link hover:text-sale transition-colors"
          >
            <Trash2 className={trashSize} />
          </button>
        </div>
      </div>
      <p className={`${totalText} font-semibold text-text-primary dark:text-text-on-dark flex-shrink-0`}>
        {formatEgpSimple(item.unitPriceEgp * item.quantity)}
      </p>
    </div>
  );
}
