import Link from 'next/link';
import { Home } from 'lucide-react';
import { cn } from '@/modules/_shared/utils/cn';
import { breadcrumbTokens as tk } from './breadcrumb.tokens';
import type { BreadcrumbProps } from './breadcrumb.types';

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn(tk.nav, className)}>
      <Link href="/" className={tk.homeLink} aria-label="Home">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <span className={tk.separator}>/</span>
          {item.href ? (
            <Link href={item.href} className={tk.itemLink}>
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className={tk.currentItem}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumb;
