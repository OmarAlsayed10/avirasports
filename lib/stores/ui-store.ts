'use client';

import { create } from 'zustand';

type UIStore = {
  cartDrawerOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
};

export const useUIStore = create<UIStore>()((set) => ({
  cartDrawerOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,

  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
}));
