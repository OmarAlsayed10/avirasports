export const footerTokens = {
  root: 'bg-bg-dark dark:bg-[#f5f5f3] text-text-on-dark dark:text-text-primary',
  inner: 'max-w-content mx-auto px-site py-10 md:py-14',
  grid: 'grid grid-cols-2 md:grid-cols-4 gap-8',
  brand: 'col-span-2 md:col-span-1',
  logoWrapper: 'inline-block bg-bg-page rounded mb-1',
  tagline: 'text-xs font-semibold uppercase tracking-widest text-primary-btn mb-3',
  description: 'text-sm text-text-footer-link dark:text-text-secondary leading-relaxed',
  socialLinks: 'flex gap-3 mt-4',
  socialLink: 'text-text-footer-link dark:text-text-secondary hover:text-text-on-dark dark:hover:text-text-primary transition-colors',
  bottomBar: 'border-t border-border-footer dark:border-border-primary/20 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2',
  bottomText: 'text-xs text-text-footer-link dark:text-text-secondary',
  column: {
    heading: 'text-xs font-semibold uppercase tracking-wider text-text-on-dark dark:text-text-primary mb-4',
    list: 'space-y-2.5',
    link: 'text-sm text-text-footer-link dark:text-text-secondary hover:text-text-on-dark dark:hover:text-text-primary transition-colors break-all',
  },
} as const;
