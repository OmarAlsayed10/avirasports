export const noResultsTokens = {
  wrapper: 'flex flex-col items-center justify-center py-20 text-center',
  iconWrapper: 'w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-bg-page dark:bg-bg-surface',
  icon: 'w-12 h-12 text-text-placeholder',
  title: 'text-newsletter-sub font-semibold text-text-primary dark:text-text-on-dark mb-2',
  sub: 'text-nav-sm text-text-secondary dark:text-text-footer-link max-w-sm mb-6',
  btnRow: 'flex gap-3',
  clearBtn: 'px-6 py-2.5 bg-primary dark:bg-bg-white text-text-on-dark dark:text-text-primary rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 dark:hover:bg-bg-page transition-colors',
  viewAllLink: 'px-6 py-2.5 border border-border-primary dark:border-white/20 text-text-primary dark:text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-bg-page dark:hover:bg-bg-surface transition-colors',
} as const;
