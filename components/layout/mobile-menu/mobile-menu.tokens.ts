export const mobileMenuTokens = {
  backdrop: 'fixed inset-0 z-[52] bg-black/50',
  panel: 'fixed top-0 left-0 z-[55] h-full w-72 bg-bg-white dark:bg-bg-surface shadow-xl flex flex-col',
  header: 'flex items-center justify-between px-6 h-16 border-b border-border-primary dark:border-white/10',
  closeBtn: 'p-1 text-text-primary dark:text-text-on-dark hover:text-primary-btn transition-colors',
  nav: 'flex-1 min-h-0 overflow-y-auto py-4',
  navLink: 'flex items-center gap-3 px-6 py-3 text-nav-sm font-medium text-text-primary dark:text-text-on-dark hover:bg-bg-page dark:hover:bg-bg-dark hover:text-primary-btn transition-colors',
  iconWrapper: 'relative flex-shrink-0',
  cartBadge: 'absolute -top-1 -right-1 w-4 h-4 bg-primary-btn rounded-full flex items-center justify-center text-[10px] font-medium text-bg-dark',
  footer: 'flex-shrink-0 border-t border-border-primary dark:border-white/10 px-6 py-4 space-y-2',
  accountLink: 'block w-full text-center py-2 text-nav-sm font-medium text-text-primary hover:text-primary transition-colors',
  signOutBtn: 'block w-full text-center py-2 text-nav-sm font-medium text-sale hover:text-sale/80 transition-colors',
  signInLink: 'block w-full text-center py-2 text-nav-sm font-medium text-text-primary hover:text-primary transition-colors',
} as const;
