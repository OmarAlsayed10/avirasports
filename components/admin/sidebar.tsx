"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Layers,
  LayoutList,
  Ticket,
  MoreHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/lib/i18n/context";
import type { Locale } from "@/lib/locale";
import { useState, useEffect } from "react";
import { LocaleToggle } from "@/components/layout/locale-toggle";
import { ThemeToggle } from "@/components/admin/theme-toggle";

const MOBILE_PINNED = 3;

export default function AdminSidebar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { t } = useLocale();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => { setMoreOpen(false); }, [pathname]);

  const navItems = [
    { href: "/admin", label: t.admin.dashboard, icon: LayoutDashboard, exact: true },
    { href: "/admin/products", label: t.admin.products, icon: Package },
    { href: "/admin/orders", label: t.admin.orders, icon: ShoppingBag },
    { href: "/admin/categories", label: t.admin.categories, icon: Tag },
    { href: "/admin/brands", label: t.admin.brands, icon: Layers },
    { href: "/admin/homepage", label: t.admin.homepage, icon: LayoutList },
    { href: "/admin/offers", label: t.admin.offers, icon: Ticket },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const pinnedItems = navItems.slice(0, MOBILE_PINNED);
  const overflowItems = navItems.slice(MOBILE_PINNED);
  const overflowActive = overflowItems.some(({ href, exact }) => isActive(href, exact));

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-56 bg-primary fixed top-0 left-0 h-screen z-30">
        <div className="px-5 py-4 border-b border-white/10 shrink-0">
          <p className="text-white font-semibold text-sm tracking-wide">
            <Link href={"/"}>{t.admin.aviraAdmin}</Link>
          </p>
        </div>

        <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive(href, exact)
                  ? "bg-white/15 text-white"
                  : "text-white/65 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop sidebar footer: locale + theme toggles */}
        <div className="border-t border-white/10 px-4 py-3 flex items-center gap-2 shrink-0">
          <LocaleToggle locale={locale} />
          <ThemeToggle />
        </div>
      </aside>

      {/* Desktop spacer */}
      <div className="hidden lg:block w-56 shrink-0" />

      {/* ── Mobile top header ────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-primary h-12 flex items-center justify-between px-4 border-b border-white/10">
        <p className="text-white font-semibold text-sm tracking-wide">
          <Link href={"/"}>{t.admin.aviraAdmin}</Link>
        </p>
        <div className="flex items-center gap-2">
          <LocaleToggle locale={locale} />
          <ThemeToggle />
        </div>
      </header>

      {/* ── Mobile bottom bar ────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-primary border-t border-white/10 flex items-center justify-around px-2 h-16">
        {pinnedItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full text-[10px] font-medium transition-colors",
                active ? "text-white" : "text-white/50 hover:text-white/80",
              )}
            >
              <Icon className={cn("w-5 h-5", active && "drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]")} />
              <span className="leading-none text-center w-full" dir="auto">{label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setMoreOpen((v) => !v)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 flex-1 h-full text-[10px] font-medium transition-colors",
            moreOpen || overflowActive ? "text-white" : "text-white/50 hover:text-white/80",
          )}
          aria-label={t.admin.more}
        >
          {moreOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <MoreHorizontal className={cn("w-5 h-5", overflowActive && "drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]")} />
          )}
          <span className="leading-none" dir="auto">{t.admin.more}</span>
        </button>
      </nav>

      {/* More overflow drawer */}
      {moreOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setMoreOpen(false)} />
          <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-primary border-t border-white/10 shadow-lg">
            {overflowItems.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-4 px-6 py-3.5 text-sm font-medium transition-colors",
                    active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span dir="auto">{label}</span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
