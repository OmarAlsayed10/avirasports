'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, Home, ShoppingBag, Tag, Info, Heart, ShoppingCart } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useUIStore } from '@/lib/stores/ui-store';
import { useCartStore } from '@/lib/stores/cart-store';
import { useHasMounted } from '@/lib/hooks/use-has-mounted';
import { useLocale } from '@/lib/i18n/context';
import { useEffect } from 'react';

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
    { href: '/checkout', label: t.mobileMenu.cart, icon: ShoppingCart },
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
        className="fixed inset-0 z-[52] bg-black/50"
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        className="fixed top-0 left-0 z-[55] h-full w-72 bg-bg-white dark:bg-bg-surface shadow-xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-border-primary dark:border-white/10">
          <Image src="/avira-logo.png" alt="Avira" width={800} height={800} className="h-12 w-auto" unoptimized />
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label={t.mobileMenu.close}
            className="p-1 text-text-primary dark:text-text-on-dark hover:text-primary-btn transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto py-4" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-6 py-3 text-nav-sm font-medium text-text-primary dark:text-text-on-dark hover:bg-bg-page dark:hover:bg-bg-dark hover:text-primary-btn transition-colors"
            >
              <span className="relative flex-shrink-0">
                <Icon className="w-5 h-5" />
                {label === t.mobileMenu.cart && hasMounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-btn rounded-full flex items-center justify-center text-[10px] font-medium text-bg-dark">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex-shrink-0 border-t border-border-primary dark:border-white/10 px-6 py-4 space-y-2">
          {session ? (
            <>
              <Link
                href={session.user?.role === 'ADMIN' ? '/admin' : '/account'}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-nav-sm font-medium text-text-primary hover:text-primary transition-colors"
              >
                {session.user?.role === 'ADMIN' ? t.admin.dashboard : t.mobileMenu.account}
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                className="block w-full text-center py-2 text-nav-sm font-medium text-sale hover:text-sale/80 transition-colors"
              >
                {t.mobileMenu.signOut}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2 text-nav-sm font-medium text-text-primary hover:text-primary transition-colors"
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
