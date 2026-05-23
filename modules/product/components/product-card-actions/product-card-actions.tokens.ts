export const productCardActionsTokens = {
  wishlistBtn: 'flex items-center justify-center w-8 h-8 rounded-full bg-bg-white/90 dark:bg-bg-surface/90 hover:bg-bg-white dark:hover:bg-bg-surface shadow-sm transition-colors',
  wishlistIcon: {
    active: 'w-4 h-4 fill-sale text-sale',
    inactive: 'w-4 h-4 text-text-primary dark:text-text-on-dark',
  },
  quickAddBtn: 'flex items-center justify-center gap-1.5 w-full py-2 bg-primary-btn text-text-on-dark rounded-btn-sm text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary transition-colors',
} as const;
