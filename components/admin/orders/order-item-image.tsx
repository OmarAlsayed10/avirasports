'use client';

import cloudinaryLoader from '@/lib/cloudinary-loader';

function toImageUrl(src: string) {
  if (!src) return src;
  if (src.startsWith('http') || src.startsWith('/')) return src;
  return cloudinaryLoader({ src, width: 96, quality: 80 });
}

export function OrderItemImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={toImageUrl(src)}
      alt={alt}
      className="w-full h-full object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}
