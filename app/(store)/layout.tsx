import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { listCategories } from '@/lib/queries/categories';
import { getLocale } from '@/lib/locale';

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  const allCategories = await listCategories();
  const navCategories = allCategories.slice(0, 8);

  return (
    <>
      <Header locale={locale} categories={navCategories} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
