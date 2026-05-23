'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/modules/_shared/utils/cn';
import { productGalleryTokens } from './product-gallery.tokens';
import type { ProductGalleryProps } from './product-gallery.types';

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? { url: '/placeholder-product.jpg', alt: productName };

  return (
    <div className={productGalleryTokens.root}>
      <div className={productGalleryTokens.mainImage}>
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt}
          fill
          priority
          className={productGalleryTokens.mainImageImg}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <div className={productGalleryTokens.thumbs} role="list" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={i}
              role="listitem"
              onClick={() => setSelectedIndex(i)}
              aria-label={`View image ${i + 1}: ${img.alt}`}
              aria-current={i === selectedIndex}
              className={cn(
                productGalleryTokens.thumb,
                i === selectedIndex
                  ? productGalleryTokens.thumbActive
                  : productGalleryTokens.thumbInactive
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
