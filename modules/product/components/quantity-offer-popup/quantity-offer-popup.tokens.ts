export const quantityOfferPopupTokens = {
  overlay: 'fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm',
  panel: 'relative w-full max-w-sm bg-bg-white dark:bg-bg-surface rounded-2xl shadow-2xl p-6 border border-border-primary/20',
  closeBtn: 'absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors',
  iconWrapper: 'w-10 h-10 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center shrink-0',
  icon: 'w-5 h-5 text-primary dark:text-white/70',
  eyebrow: 'text-xs font-semibold text-primary dark:text-white/60 uppercase tracking-wide',
  productName: 'text-sm font-semibold text-text-primary dark:text-text-on-dark line-clamp-1',
  offerCard: 'rounded-xl bg-primary/5 dark:bg-white/5 border border-primary/20 dark:border-white/10 p-4',
  offerTitle: 'text-base font-bold text-text-primary dark:text-text-on-dark',
  offerSavings: 'text-sm text-text-secondary dark:text-text-on-dark/60 mt-1',
  ctaBtn: 'mt-4 w-full py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors',
} as const;
