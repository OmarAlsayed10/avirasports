'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatEgp } from '@/modules/_shared/utils/format-egp';
import { searchResultItemTokens as tk } from './search-result-item.tokens';
import type { ProductResultItemProps, CategoryResultItemProps } from './search-result-item.types';

export function ProductResultItem({ item, onSelect }: ProductResultItemProps) {
  const finalPrice = item.discountPercent
    ? Math.round(item.priceEgp * (1 - item.discountPercent / 100))
    : item.priceEgp;

  return (
    <Link
      href={`/product/${item.slug}`}
      onClick={() => onSelect(item.name)}
      className={tk.productLink}
    >
      <div className={tk.productImageWrapper}>
        <Image src={item.imageUrl} alt={item.imageAlt} fill sizes="40px" className="object-contain p-1" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={tk.productName}>{item.name}</p>
        <p className={tk.productBrand}>{item.brand}</p>
      </div>
      <span className={tk.productPrice}>{formatEgp(finalPrice)}</span>
    </Link>
  );
}

export function CategoryResultItem({ item, onSelect }: CategoryResultItemProps) {
  return (
    <Link
      href={`/shop?category=${item.slug}`}
      onClick={() => onSelect(item.name)}
      className={tk.categoryLink}
    >
      <span className={tk.categoryIcon} aria-hidden="true">⊞</span>
      <span className={tk.categoryName}>{item.name}</span>
    </Link>
  );
}
