'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WishlistItem = {
  productId: string;
  name: string;
  brand: string;
  imageUrl: string;
  priceEgp: number;
  discountPercent?: number;
  slug: string;
};

type WishlistStore = {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (productId: string) => boolean;
  removeItem: (productId: string) => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.productId === item.productId);
          return {
            items: exists
              ? state.items.filter((i) => i.productId !== item.productId)
              : [...state.items, item],
          };
        }),

      isWishlisted: (productId) =>
        get().items.some((i) => i.productId === productId),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
    }),
    {
      name: 'avira-wishlist-v1',
    }
  )
);
