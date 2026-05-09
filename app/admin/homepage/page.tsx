import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getAllHomepageSections } from '@/lib/queries/homepage';
import { HomepageEditor } from '@/components/admin/homepage/homepage-editor';
import { initDefaultSections } from '@/lib/server-actions/admin/homepage';
import { getT } from '@/lib/locale';

export const metadata: Metadata = { title: 'Homepage Sections' };

export default async function HomepageAdminPage() {
  await initDefaultSections();

  const [sections, categories] = await Promise.all([
    getAllHomepageSections(),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true, nameAr: true } }),
  ]);

  const { t } = getT();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t.admin.homepageSectionsHeading}</h1>
          <p className="text-sm text-gray-500 mt-1">{t.admin.homepageSectionsSub}</p>
        </div>
      </div>

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <strong>Tip:</strong> {t.admin.homepageTipBody}
      </div>

      <HomepageEditor
        sections={sections.map((s) => ({
          ...s,
          category: s.category
            ? { id: s.category.id, slug: s.category.slug, name: s.category.name, nameAr: s.category.nameAr }
            : null,
        }))}
        allCategories={categories}
      />
    </div>
  );
}
