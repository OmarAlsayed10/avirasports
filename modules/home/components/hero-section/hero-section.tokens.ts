export const heroSectionTokens = {
  root: 'relative bg-primary dark:bg-white overflow-hidden min-h-[280px] md:min-h-hero',
  glow: 'absolute right-0 top-1/2 -translate-y-1/2 w-[300px] md:w-[400px] h-[300px] md:h-[400px] rounded-full bg-primary-btn/20 blur-2xl will-change-transform pointer-events-none',
  inner: 'relative max-w-content mx-auto px-site py-12 md:py-0 md:h-hero flex items-center',
  content: 'max-w-xl',
  eyebrow: 'text-xs md:text-nav-sm font-medium text-text-footer-link dark:text-text-secondary mb-2 md:mb-3 uppercase tracking-widest',
  heading: 'font-secondary text-5xl sm:text-6xl md:text-7xl font-black uppercase leading-none tracking-tight text-text-on-dark dark:text-text-primary mb-3 md:mb-4',
  headingAccent: 'text-primary-btn',
  sub: 'text-base md:text-lg text-text-footer-link dark:text-text-secondary mb-6 md:mb-8 leading-relaxed',
  ctaRow: 'flex flex-wrap gap-3',
  primaryCta: 'px-6 md:px-8 py-3 md:py-3.5 bg-primary-btn text-bg-dark rounded-btn-sm text-sm font-semibold hover:bg-primary-btn/90 transition-colors',
  secondaryCta: 'px-6 md:px-8 py-3 md:py-3.5 border-2 border-text-on-dark dark:border-text-primary text-text-on-dark dark:text-text-primary rounded-btn-sm text-sm font-semibold hover:bg-text-on-dark/10 dark:hover:bg-text-primary/10 transition-colors',
} as const;
