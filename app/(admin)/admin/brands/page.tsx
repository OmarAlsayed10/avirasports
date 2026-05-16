import { prisma } from '@/infrastructure/db/prisma';
import BrandList from '@/modules/admin/brands/components/brand-list';
import type { Metadata } from 'next';
import { getT } from '@/modules/_shared/i18n/locale';

export const metadata: Metadata = { title: 'Brands' };

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
  const { t } = getT();
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{t.admin.brandsTitle}</h1>
      <BrandList brands={brands} />
    </div>
  );
}
