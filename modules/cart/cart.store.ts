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
  addOnId?: string;
  quantityOfferId?: string;
};

const sameLine = (
  item: CartItem,
  productId: string,
  variantId?: string,
  addOnId?: string
) =>
  item.productId === productId &&
  item.variantId === variantId &&
  item.addOnId === addOnId;

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (productId: string, variantId?: string, addOnId?: string) => void;
  updateQuantity: (productId: string, qty: number, variantId?: string, addOnId?: string) => void;
  updateNote: (productId: string, note: string, variantId?: string, addOnId?: string) => void;
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
            (i) => sameLine(i, item.productId, item.variantId, item.addOnId) && i.quantityOfferId === item.quantityOfferId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.variantId, item.addOnId) && i.quantityOfferId === item.quantityOfferId
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        }),

      removeItem: (productId, variantId, addOnId) =>
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, productId, variantId, addOnId)),
        })),

      updateQuantity: (productId, qty, variantId, addOnId) =>
        set((state) => ({
          items: state.items.map((i) =>
            sameLine(i, productId, variantId, addOnId)
              ? { ...i, quantity: Math.max(1, qty) }
              : i
          ),
        })),

      updateNote: (productId, note, variantId, addOnId) =>
        set((state) => ({
          items: state.items.map((i) =>
            sameLine(i, productId, variantId, addOnId)
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
