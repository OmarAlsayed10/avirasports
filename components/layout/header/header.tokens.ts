export const headerTokens = {
  root: 'sticky top-0 z-50 bg-bg-page dark:bg-bg-surface shadow-sm dark:shadow-none dark:border-b dark:border-white/10',
  inner: 'max-w-content mx-auto px-site h-16 md:h-main-nav flex items-center justify-between gap-4 md:gap-8',
  menuBtn: 'md:hidden p-1 text-text-primary dark:text-text-on-dark hover:text-primary-btn transition-colors',
  searchWrapper: 'hidden md:block flex-1',
  actions: 'flex items-center gap-3 md:gap-cart-icon flex-shrink-0',
  mobileSearchWrapper: 'md:hidden',
  userIconWrapper: 'hidden md:block',
  navBar: 'hidden md:block bg-primary dark:bg-bg-page',
  nav: 'max-w-nav-bar mx-auto h-nav-pill flex items-center justify-center gap-12 px-8',
  navLink: 'text-card font-medium text-text-on-dark dark:text-text-primary hover:text-primary-btn dark:hover:text-primary-btn transition-colors',
} as const;
