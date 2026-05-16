'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { UserCircle, User, MapPin, Package, LogOut, ChevronRight, Loader2, LayoutDashboard } from 'lucide-react';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function UserIcon() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  if (status === 'loading') {
    return <Loader2 className="w-6 h-6 text-text-secondary dark:text-text-footer-link animate-spin" aria-hidden="true" />;
  }

  if (!session) {
    return (
      <Link href="/login" aria-label="Sign in">
        <UserCircle className="w-6 h-6 text-text-primary dark:text-text-on-dark" />
      </Link>
    );
  }

  const { name, email, image } = session.user ?? {};
  const isAdmin = session.user.role === 'ADMIN';
  const initials = name ? getInitials(name) : '?';

  const menuItems = isAdmin
    ? [{ href: '/admin', label: t.account.adminPanel, icon: LayoutDashboard }]
    : [
        { href: '/account', label: t.account.title, icon: User },
        { href: '/account/orders', label: t.account.myOrders, icon: Package },
        { href: '/account/addresses', label: t.account.addresses, icon: MapPin },
      ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.account.title}
        className="w-8 h-8 rounded-full bg-primary-btn flex items-center justify-center overflow-hidden flex-shrink-0"
      >
        {image ? (
          <Image src={image} alt={name ?? 'Avatar'} width={32} height={32} className="w-full h-full object-cover" />
        ) : (
          <span className="font-secondary font-black text-xs text-bg-dark">{initials}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-bg-white dark:bg-bg-surface rounded-card-lg shadow-newsletter border border-border-primary/10 dark:border-white/10 overflow-hidden z-50">
          <div className="px-4 py-4 bg-bg-page dark:bg-bg-dark border-b border-border-primary/10 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary-btn flex items-center justify-center overflow-hidden flex-shrink-0">
                {image ? (
                  <Image src={image} alt={name ?? 'Avatar'} width={44} height={44} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-secondary font-black text-sm text-bg-dark">{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                {name && (
                  <p className="text-sm font-semibold text-text-primary dark:text-text-on-dark truncate">{name}</p>
                )}
                {email && (
                  <p className="text-xs text-text-secondary dark:text-text-footer-link truncate">{email}</p>
                )}
              </div>
            </div>
          </div>

          <nav className="py-1">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary dark:text-text-on-dark hover:bg-bg-page dark:hover:bg-bg-dark transition-colors group"
              >
                <Icon className="w-4 h-4 text-text-secondary dark:text-text-footer-link group-hover:text-primary-btn transition-colors flex-shrink-0" />
                <span className="flex-1">{label}</span>
                <ChevronRight className="w-3 h-3 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </nav>

          <div className="border-t border-border-primary/10 dark:border-white/10 py-1">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-sale hover:bg-sale/5 transition-colors"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>{t.account.signOut}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
