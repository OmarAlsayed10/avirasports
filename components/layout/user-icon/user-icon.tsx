'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { UserCircle, User, MapPin, Package, LogOut, ChevronRight, Loader2, LayoutDashboard } from 'lucide-react';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { userIconTokens as tk } from './user-icon.tokens';

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

  const menuItems = isAdmin
    ? [{ href: '/admin', label: t.account.adminPanel, icon: LayoutDashboard }]
    : [
        { href: '/account', label: t.account.title, icon: User },
        { href: '/account/orders', label: t.account.myOrders, icon: Package },
        { href: '/account/addresses', label: t.account.addresses, icon: MapPin },
      ];

  return (
    <div ref={ref} className={tk.wrapper}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.account.title}
        className={tk.triggerBtn}
      >
        {image ? (
          <Image src={image} alt={name ?? 'Avatar'} width={32} height={32} className="w-full h-full object-cover" />
        ) : (
          <User className="w-4 h-4 text-bg-dark" />
        )}
      </button>

      {open && (
        <div className={tk.dropdown}>
          <div className={tk.dropdownHeader}>
            <div className={tk.dropdownHeaderInner}>
              <div className={tk.avatar}>
                {image ? (
                  <Image src={image} alt={name ?? 'Avatar'} width={44} height={44} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-bg-dark" />
                )}
              </div>
              <div className={tk.userInfo}>
                {name && <p className={tk.userName}>{name}</p>}
                {email && <p className={tk.userEmail}>{email}</p>}
              </div>
            </div>
          </div>

          <nav className={tk.menuNav}>
            {menuItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={tk.menuItem}
              >
                <Icon className={tk.menuItemIcon} />
                <span className={tk.menuItemLabel}>{label}</span>
                <ChevronRight className={tk.menuItemChevron} />
              </Link>
            ))}
          </nav>

          <div className={tk.signOutSection}>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className={tk.signOutBtn}
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
