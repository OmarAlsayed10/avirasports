export const notFoundTokens = {
  root: 'min-h-[60vh] flex flex-col items-center justify-center px-site text-center py-20',
  code: 'text-8xl font-semibold text-primary/20 dark:text-white/10 mb-6 select-none',
  heading: 'text-section-heading font-semibold text-text-primary dark:text-text-on-dark mb-3',
  sub: 'text-nav-sm text-text-secondary dark:text-text-footer-link mb-8 max-w-md',
  actions: 'flex flex-col sm:flex-row gap-3',
  primaryBtn: 'px-6 py-3 bg-primary text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 transition-colors',
  secondaryBtn: 'px-6 py-3 border border-border-primary/40 dark:border-white/30 text-text-primary dark:text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:border-primary dark:hover:border-white/60 transition-colors',
} as const;
