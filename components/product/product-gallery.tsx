'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

interface ProductImage {
  url: string;
  alt: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? { url: '/placeholder-product.jpg', alt: productName };

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square bg-bg-page dark:bg-bg-dark rounded-carousel overflow-hidden group">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt}
          fill
          priority
          className="object-contain p-6 transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={i}
              role="listitem"
              onClick={() => setSelectedIndex(i)}
              aria-label={`View image ${i + 1}: ${img.alt}`}
              aria-current={i === selectedIndex}
              className={cn(
                'relative flex-shrink-0 w-16 h-16 rounded-tag border-2 overflow-hidden bg-bg-page dark:bg-bg-dark transition-colors',
                i === selectedIndex
                  ? 'border-primary'
                  : 'border-border-primary/20 dark:border-white/15 hover:border-primary/50'
              )}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
