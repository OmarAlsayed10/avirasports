'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { CartIcon } from '@/components/cart/cart-icon';
import { WishlistIcon } from '@/components/wishlist/wishlist-icon';
import { SearchTrigger } from './search-trigger';
import { UserIcon } from './user-icon';
import { ThemeToggle } from './theme-toggle';
import { LocaleToggle } from './locale-toggle';
import { useUIStore } from '@/lib/stores/ui-store';
import { useLocale } from '@/lib/i18n/context';
import type { Locale } from '@/lib/locale';

type NavCategory = { slug: string; name: string; nameAr?: string | null };

export function Header({ locale, categories }: { locale: Locale; categories: NavCategory[] }) {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { t } = useLocale();

  const NAV_LINKS = categories.map((cat) => ({
    href: `/shop?category=${cat.slug}`,
    label: locale === 'ar' ? (cat.nameAr ?? cat.name) : cat.name,
  }));

  return (
    <header className="sticky top-0 z-50 bg-bg-white dark:bg-bg-surface shadow-sm dark:shadow-none dark:border-b dark:border-white/10">
      <div className="max-w-content mx-auto px-site h-16 md:h-main-nav flex items-center justify-between gap-4 md:gap-8">
        <button
          className="md:hidden p-1 text-text-primary dark:text-text-on-dark hover:text-primary-btn transition-colors"
          aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link href="/" aria-label={t.nav.home}>
          <Image
            src="/avira-logo.png"
            alt="Avira"
            width={800}
            height={800}
            className="h-16 w-auto"
            priority
            unoptimized
          />
        </Link>

        <div className="hidden md:block flex-1">
          <SearchTrigger />
        </div>

        <div className="flex items-center gap-3 md:gap-cart-icon flex-shrink-0">
          <div className="md:hidden">
            <SearchTrigger iconOnly />
          </div>
          <LocaleToggle locale={locale} />
          <ThemeToggle />
          <WishlistIcon />
          <div className="hidden md:block">
            <UserIcon />
          </div>
          <div className="hidden md:block">
            <CartIcon />
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-primary dark:bg-white">
        <nav
          className="max-w-nav-bar mx-auto h-nav-pill flex items-center justify-center gap-12 px-8"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-card font-medium text-text-on-dark dark:text-text-primary hover:text-primary-btn dark:hover:text-primary-btn transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
