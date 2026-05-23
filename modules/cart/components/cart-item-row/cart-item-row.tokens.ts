export const cartItemRowTokens = {
  itemAttributes: {
    wrapper: 'flex items-center gap-1.5 flex-wrap mt-0.5',
    colorCircle: 'w-4 h-4 rounded-full border border-border-primary/30 dark:border-white/20 shrink-0',
    text: 'text-xs text-text-secondary dark:text-text-footer-link',
  },
  itemNote: 'text-xs text-text-secondary dark:text-text-footer-link italic mt-0.5 line-clamp-2',
  drawer: {
    wrapper: 'flex gap-3',
    imageWrapper: 'relative w-16 h-16 flex-shrink-0 bg-bg-page dark:bg-bg-dark rounded-tag overflow-hidden',
    body: 'flex-1 min-w-0',
    name: 'text-nav-sm font-medium text-text-primary dark:text-text-on-dark line-clamp-2 leading-tight',
    unitPrice: 'text-xs text-text-secondary dark:text-text-footer-link mt-0.5',
    controls: 'flex items-center justify-between mt-2',
    stepper: 'flex items-center border border-border-primary/30 dark:border-white/10 rounded-full overflow-hidden',
    stepperBtn: 'w-7 h-7 flex items-center justify-center text-text-primary dark:text-text-on-dark disabled:opacity-40 hover:bg-bg-page dark:hover:bg-bg-dark transition-colors',
    stepperQty: 'w-8 text-center text-xs font-semibold text-text-primary dark:text-text-on-dark',
    removeBtn: 'text-text-placeholder dark:text-text-footer-link hover:text-sale transition-colors',
    totalPrice: 'text-nav-sm font-semibold text-text-primary dark:text-text-on-dark flex-shrink-0',
  },
  dropdown: {
    imageWrapper: 'relative w-14 h-14 flex-shrink-0 bg-bg-page dark:bg-bg-dark rounded-tag overflow-hidden',
    name: 'text-xs font-medium text-text-primary dark:text-text-on-dark line-clamp-2 leading-tight',
    stepperBtn: 'w-6 h-6 flex items-center justify-center text-text-primary dark:text-text-on-dark disabled:opacity-40 hover:bg-bg-page dark:hover:bg-bg-dark transition-colors',
    stepperQty: 'w-6 text-center text-xs font-semibold text-text-primary dark:text-text-on-dark',
    totalPrice: 'text-xs font-semibold text-text-primary dark:text-text-on-dark flex-shrink-0',
    controls: 'flex items-center justify-between mt-1.5',
  },
} as const;
