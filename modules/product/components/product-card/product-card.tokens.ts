export const productCardTokens = {
  root: 'group relative flex flex-col bg-bg-white dark:bg-bg-surface rounded-carousel border border-border-primary/10 dark:border-white/10 overflow-hidden hover:shadow-md transition-shadow',
  linkWrapper: 'block flex-1',
  imageWrapper: 'relative aspect-square bg-bg-page dark:bg-bg-dark overflow-hidden',
  image: 'object-contain p-4 group-hover:scale-105 transition-transform duration-300',
  discountBadge: 'absolute top-2 left-2 px-2 py-0.5 bg-sale text-text-on-dark text-xs font-semibold rounded-tag',
  outOfStockOverlay: 'absolute inset-0 bg-bg-white/70 dark:bg-bg-surface/70 flex items-center justify-center',
  outOfStockLabel: 'text-sm font-semibold text-text-secondary dark:text-text-footer-link',
  body: 'p-4',
  brand: 'text-xs text-text-secondary dark:text-text-footer-link font-medium mb-1',
  name: 'text-base font-semibold text-text-primary dark:text-text-on-dark leading-tight line-clamp-2 mb-2',
  actions: 'px-4 pb-4 flex flex-col gap-2',
  wishlistWrapper: 'absolute top-2 right-2',
} as const;
