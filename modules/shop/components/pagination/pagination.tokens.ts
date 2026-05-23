export const paginationTokens = {
  nav: 'flex items-center justify-center gap-1 mt-8',
  btn: 'flex items-center justify-center w-10 h-10 rounded-btn-sm border border-border-primary/30 dark:border-white/20 text-text-primary dark:text-text-on-dark disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors',
  pageBtn: 'flex items-center justify-center w-10 h-10 rounded-btn-sm border text-nav-sm transition-colors',
  pageBtnActive: 'border-primary bg-primary text-text-on-dark font-semibold',
  pageBtnInactive: 'border-border-primary/30 dark:border-white/20 text-text-primary dark:text-text-on-dark hover:border-primary hover:text-primary',
  ellipsis: 'w-10 text-center text-text-secondary dark:text-text-footer-link',
} as const;
