'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/modules/_shared/utils/cn';
import { productTokens } from '../product.tokens';

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
    <div className={productTokens.gallery.root}>
      <div className={productTokens.gallery.mainImage}>
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt}
          fill
          priority
          className={productTokens.gallery.mainImageImg}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <div className={productTokens.gallery.thumbs} role="list" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={i}
              role="listitem"
              onClick={() => setSelectedIndex(i)}
              aria-label={`View image ${i + 1}: ${img.alt}`}
              aria-current={i === selectedIndex}
              className={cn(
                productTokens.gallery.thumb,
                i === selectedIndex
                  ? productTokens.gallery.thumbActive
                  : productTokens.gallery.thumbInactive
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
