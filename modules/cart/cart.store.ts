'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  variantId?: string;
  name: string;
  nameAr?: string;
  brand: string;
  imageUrl: string;
  unitPriceEgp: number;
  quantity: number;
  stockCount?: number;
  attributes?: Record<string, string>;
  note?: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, qty: number, variantId?: string) => void;
  updateNote: (productId: string, note: string, variantId?: string) => void;
  clearCart: () => void;
  itemCount: () => number;
  totalEgp: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),

      updateQuantity: (productId, qty, variantId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: Math.max(1, qty) }
              : i
          ),
        })),

      updateNote: (productId, note, variantId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, note: note || undefined }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalEgp: () =>
        get().items.reduce((sum, i) => sum + i.unitPriceEgp * i.quantity, 0),
    }),
    {
      name: 'avira-cart-v1',
    }
  )
);
