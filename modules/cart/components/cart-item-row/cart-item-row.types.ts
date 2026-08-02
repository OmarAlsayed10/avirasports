import type { CartItem } from '@/modules/cart/cart.store';

export interface CartItemRowProps {
  item: CartItem;
  variant: 'drawer' | 'dropdown';
  onUpdateQuantity: (productId: string, qty: number, variantId?: string, addOnId?: string) => void;
  onRemove: (productId: string, variantId?: string, addOnId?: string) => void;
}
