export const addToCartSectionTokens = {
  brand: 'text-xs text-text-secondary dark:text-text-footer-link font-medium mb-1',
  wrapper: 'space-y-4',
  skeleton: 'space-y-4 animate-pulse',
  addToCartBtn: 'flex-1 flex items-center justify-center gap-2 py-3 bg-primary-btn text-text-on-dark rounded-btn-sm text-nav-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary transition-colors',
  wishlistBtn: 'flex items-center justify-center w-12 h-12 border border-border-primary/40 dark:border-white/20 rounded-btn-sm hover:border-primary transition-colors',
  wishlistIcon: {
    active: 'w-5 h-5 fill-sale text-sale',
    inactive: 'w-5 h-5 text-text-primary dark:text-text-on-dark',
  },
  outOfStockMsg: 'text-nav-sm text-text-secondary',
  actionsRow: 'flex gap-3',
  noteLabel: 'block text-sm font-medium text-text-primary dark:text-text-on-dark mb-1',
  noteTextarea: 'w-full px-3 py-2.5 border border-border-primary/30 dark:border-white/15 rounded-lg text-sm text-text-primary dark:text-text-on-dark bg-bg-white dark:bg-bg-surface placeholder-text-placeholder dark:placeholder-text-footer-link focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-colors',
} as const;
