'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, Home, ShoppingBag, Tag, Info, Heart, ShoppingCart, MessageSquare } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useUIStore } from '@/modules/_shared/stores/ui.store';
import { useCartStore } from '@/modules/cart/cart.store';
import { useHasMounted } from '@/modules/_shared/hooks/use-has-mounted';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { useEffect } from 'react';
import { mobileMenuTokens as tk } from './mobile-menu.tokens';

export function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.itemCount());
  const hasMounted = useHasMounted();
  const { t } = useLocale();

  const NAV_LINKS = [
    { href: '/', label: t.mobileMenu.home, icon: Home },
    { href: '/shop', label: t.mobileMenu.shop, icon: ShoppingBag },
    { href: '/shop?onSale=true', label: t.mobileMenu.deals, icon: Tag },
    { href: '/about', label: t.mobileMenu.about, icon: Info },
    { href: '/wishlist', label: t.mobileMenu.wishlist, icon: Heart },
    { href: '/cart', label: t.mobileMenu.cart, icon: ShoppingCart },
    { href: '/feedback', label: t.mobileMenu.feedback, icon: MessageSquare },
  ];

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  if (!mobileMenuOpen) return null;

  return (
    <>
      <div
        className={tk.backdrop}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        className={tk.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className={tk.header}>
          <Image src="/avira-logo.png" alt="Avira" width={800} height={800} className="h-12 w-auto" unoptimized />
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label={t.mobileMenu.close}
            className={tk.closeBtn}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className={tk.nav} aria-label="Mobile navigation">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className={tk.navLink}
            >
              <span className={tk.iconWrapper}>
                <Icon className="w-5 h-5" />
                {label === t.mobileMenu.cart && hasMounted && itemCount > 0 && (
                  <span className={tk.cartBadge}>
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </span>
              {label}
            </Link>
          ))}
        </nav>

        <div className={tk.footer}>
          {session ? (
            <>
              <Link
                href={session.user?.role === 'ADMIN' ? '/admin' : '/account'}
                onClick={() => setMobileMenuOpen(false)}
                className={tk.accountLink}
              >
                {session.user?.role === 'ADMIN' ? t.admin.dashboard : t.mobileMenu.account}
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                className={tk.signOutBtn}
              >
                {t.mobileMenu.signOut}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className={tk.signInLink}
            >
              {t.mobileMenu.signIn}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default MobileMenu;
