import { prisma } from '@/infrastructure/db/prisma';
import CategoryList from '@/modules/admin/categories/components/category-list';
import type { Metadata } from 'next';
import { getT } from '@/modules/_shared/i18n/locale';

export const metadata: Metadata = { title: 'Categories' };

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, nameAr: true, slug: true, description: true, iconUrl: true, sortOrder: true, hasMultipleSizes: true, _count: { select: { products: true } } },
  });

  const { t } = getT();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{t.admin.categoriesTitle}</h1>
      <CategoryList categories={categories} />
    </div>
  );
}
