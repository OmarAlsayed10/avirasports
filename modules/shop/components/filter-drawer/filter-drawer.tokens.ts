export const filterDrawerTokens = {
  triggerBtn: 'w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border-primary dark:border-white/20 rounded-btn-sm text-base font-medium text-text-primary dark:text-text-on-dark bg-bg-white dark:bg-bg-surface',
  overlay: 'fixed inset-0 z-[52] bg-black/50',
  panel: 'fixed top-0 right-0 z-[55] h-full w-80 bg-bg-white dark:bg-bg-surface shadow-xl flex flex-col',
  header: 'flex items-center justify-between px-6 py-4 border-b border-border-primary/20 dark:border-white/10 flex-shrink-0',
  headerTitle: 'text-base font-semibold text-text-primary dark:text-text-on-dark',
  closeBtn: 'p-1 text-text-primary dark:text-text-on-dark hover:text-primary',
  body: 'flex-1 overflow-y-auto overscroll-contain px-6 py-4',
  footer: 'px-6 py-4 border-t border-border-primary/20 dark:border-white/10 flex-shrink-0',
  applyBtn: 'w-full py-3 bg-primary text-text-on-dark rounded-btn-sm text-base font-semibold',
} as const;
