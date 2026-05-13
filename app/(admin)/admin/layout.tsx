import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/sidebar';
import { getLocale, getT } from '@/lib/locale';
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
  const { locale, t } = getT();
  return {
    title: {
      template: `%s | ${t.admin.aviraAdmin}`,
      default: locale === 'ar' ? 'لوحة التحكم' : 'Admin',
    },
  };
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/');
  }

  const locale = getLocale();

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950" dir="ltr" data-admin>
      <AdminSidebar locale={locale} />
      <div className="flex-1 min-w-0 pt-12 pb-16 lg:pt-0 lg:pb-0">
        <main id="main-content" tabIndex={-1} className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
