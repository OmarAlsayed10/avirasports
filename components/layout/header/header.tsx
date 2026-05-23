'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { CartIcon } from '@/modules/cart/components/cart-icon';
import { WishlistIcon } from '@/modules/wishlist/components/wishlist-icon';
import { SearchTrigger } from '../search-trigger';
import { UserIcon } from '../user-icon';
import { ThemeToggle } from '../theme-toggle';
import { LocaleToggle } from '../locale-toggle';
import { useUIStore } from '@/modules/_shared/stores/ui.store';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { headerTokens as tk } from './header.tokens';
import type { HeaderProps } from './header.types';

export function Header({ locale, categories }: HeaderProps) {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { t } = useLocale();

  const NAV_LINKS = categories.map((cat) => ({
    href: `/shop?category=${cat.slug}`,
    label: locale === 'ar' ? (cat.nameAr ?? cat.name) : cat.name,
  }));

  return (
    <header className={tk.root}>
      <div className={tk.inner}>
        <button
          className={tk.menuBtn}
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

        <div className={tk.searchWrapper}>
          <SearchTrigger />
        </div>

        <div className={tk.actions}>
          <div className={tk.mobileSearchWrapper}>
            <SearchTrigger iconOnly />
          </div>
          <LocaleToggle locale={locale} />
          <ThemeToggle />
          <WishlistIcon />
          <CartIcon />
          <div className={tk.userIconWrapper}>
            <UserIcon />
          </div>
        </div>
      </div>

      <div className={tk.navBar}>
        <nav className={tk.nav} aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={tk.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
