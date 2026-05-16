import Link from 'next/link';
import { Home } from 'lucide-react';
import { cn } from '@/modules/_shared/utils/cn';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm font-light text-text-primary dark:text-text-on-dark', className)}>
      <Link href="/" className="hover:text-primary-btn transition-colors" aria-label="Home">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <span className="text-text-secondary dark:text-text-footer-link">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-primary-btn transition-colors">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-text-secondary dark:text-text-footer-link">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumb;
