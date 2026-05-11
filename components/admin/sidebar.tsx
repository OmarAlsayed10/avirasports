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
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/lib/i18n/context";
import type { Locale } from "@/lib/locale";

export default function AdminSidebar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { t } = useLocale();

  const navItems = [
    {
      href: "/admin",
      label: t.admin.dashboard,
      icon: LayoutDashboard,
      exact: true,
    },
    { href: "/admin/products", label: t.admin.products, icon: Package },
    { href: "/admin/categories", label: t.admin.categories, icon: Tag },
    { href: "/admin/brands", label: t.admin.brands, icon: Layers },
    { href: "/admin/orders", label: t.admin.orders, icon: ShoppingBag },
    { href: "/admin/homepage", label: t.admin.homepage, icon: LayoutList },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Desktop sidebar — fixed */}
      <aside className="hidden lg:flex flex-col w-56 bg-primary fixed top-0 left-0 h-screen z-30 overflow-y-auto">
        <div className="px-5 py-4 border-b border-white/10 shrink-0">
          <p className="text-white font-semibold text-sm tracking-wide">
            {t.admin.aviraAdmin}
          </p>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
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
      </aside>

      {/* Desktop spacer */}
      <div className="hidden lg:block w-56 shrink-0" />

      {/* Mobile bottom bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-primary border-t border-white/10 flex items-center justify-around px-2 h-16">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
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
              <Icon
                className={cn(
                  "w-5 h-5",
                  active && "drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]",
                )}
              />
              <span className="leading-none">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile bottom padding so content doesn't hide behind the bar */}
      <div className="lg:hidden h-16" />
    </>
  );
}
