'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Tag, Layers, Menu, X, LayoutList } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { LocaleToggle } from '@/components/layout/locale-toggle';
import { useLocale } from '@/lib/i18n/context';
import type { Locale } from '@/lib/locale';

export default function AdminSidebar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useLocale();

  const navItems = [
    { href: '/admin', label: t.admin.dashboard, icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: t.admin.products, icon: Package },
    { href: '/admin/categories', label: t.admin.categories, icon: Tag },
    { href: '/admin/brands', label: t.admin.brands, icon: Layers },
    { href: '/admin/orders', label: t.admin.orders, icon: ShoppingBag },
    { href: '/admin/homepage', label: t.admin.homepage, icon: LayoutList },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const nav = (
    <nav className="flex flex-col gap-0.5 p-3">
      {navItems.map(({ href, label, icon: Icon, exact }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
            isActive(href, exact)
              ? 'bg-white/15 text-white'
              : 'text-white/65 hover:bg-white/10 hover:text-white'
          )}
        >
          <Icon className="w-4 h-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-primary min-h-screen shrink-0 sticky top-0">
        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-white font-semibold text-sm tracking-wide">{t.admin.aviraAdmin}</p>
        </div>
        {nav}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-primary shadow-md">
        <p className="text-white font-semibold text-sm">{t.admin.aviraAdmin}</p>
        <button
          onClick={() => setOpen(!open)}
          className="text-white p-1 rounded"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-30"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <aside
            className="absolute top-14 left-0 bottom-0 w-56 bg-primary flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
