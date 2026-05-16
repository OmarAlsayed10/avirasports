'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatEgp } from '@/modules/_shared/utils/format-egp';

interface ProductResultProps {
  item: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    priceEgp: number;
    discountPercent: number | null;
    imageUrl: string;
    imageAlt: string;
  };
  onSelect: (name: string) => void;
}

export function ProductResultItem({ item, onSelect }: ProductResultProps) {
  const finalPrice = item.discountPercent
    ? Math.round(item.priceEgp * (1 - item.discountPercent / 100))
    : item.priceEgp;

  return (
    <Link
      href={`/product/${item.slug}`}
      onClick={() => onSelect(item.name)}
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg-page rounded-md transition-colors"
    >
      <div className="w-10 h-10 relative flex-shrink-0 bg-bg-page rounded overflow-hidden">
        <Image src={item.imageUrl} alt={item.imageAlt} fill className="object-contain p-1" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-nav-sm font-semibold text-text-primary truncate">{item.name}</p>
        <p className="text-xs text-text-secondary">{item.brand}</p>
      </div>
      <span className="text-nav-sm font-semibold text-text-primary flex-shrink-0">
        {formatEgp(finalPrice)}
      </span>
    </Link>
  );
}

interface CategoryResultProps {
  item: { id: string; slug: string; name: string };
  onSelect: (name: string) => void;
}

export function CategoryResultItem({ item, onSelect }: CategoryResultProps) {
  return (
    <Link
      href={`/shop?category=${item.slug}`}
      onClick={() => onSelect(item.name)}
      className="flex items-center gap-3 px-4 py-2 hover:bg-bg-page rounded-md transition-colors"
    >
      <span className="w-4 h-4 text-text-secondary" aria-hidden="true">⊞</span>
      <span className="text-nav-sm text-text-primary">{item.name}</span>
    </Link>
  );
}
