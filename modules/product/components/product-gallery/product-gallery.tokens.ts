export const productGalleryTokens = {
  root: 'flex flex-col gap-4',
  mainImage: 'relative aspect-square bg-bg-page dark:bg-bg-dark rounded-carousel overflow-hidden group',
  mainImageImg: 'object-contain p-6 transition-transform duration-300 group-hover:scale-110',
  thumbs: 'flex gap-2 overflow-x-auto pb-1',
  thumb: 'relative flex-shrink-0 w-16 h-16 rounded-tag border-2 overflow-hidden bg-bg-page dark:bg-bg-dark transition-colors',
  thumbActive: 'border-primary',
  thumbInactive: 'border-border-primary/20 dark:border-white/15 hover:border-primary/50',
} as const;
