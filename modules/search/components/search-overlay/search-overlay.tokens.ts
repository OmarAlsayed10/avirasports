export const searchOverlayTokens = {
  backdrop: 'fixed inset-0 z-[60] bg-black/40',
  panel: 'absolute top-0 left-0 right-0 bg-bg-white shadow-newsletter max-h-[90vh] overflow-y-auto',
  inner: 'max-w-content mx-auto px-site',
  searchBar: 'flex items-center gap-3 py-4 border-b border-border-primary/20',
  input: 'flex-1 text-nav-sm text-text-primary bg-transparent focus:outline-none placeholder:text-text-muted h-10',
  iconBtn: 'p-1 text-text-secondary hover:text-text-primary',
  results: 'max-w-content mx-auto px-site py-2 pb-6',
  statusText: 'text-nav-sm text-text-secondary py-4 text-center',
  sectionLabel: 'text-xs font-semibold text-text-secondary uppercase tracking-wider px-4 mb-1',
  recentItem: 'flex items-center gap-2 px-4 py-2 hover:bg-bg-page rounded-md group',
  recentText: 'flex-1 text-left text-nav-sm text-text-primary',
  recentRemoveBtn: 'opacity-0 group-hover:opacity-100 p-0.5 text-text-secondary hover:text-text-primary transition-opacity',
} as const;
