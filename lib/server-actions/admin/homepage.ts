'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from './_require-admin';

const BUILT_IN_DEFAULTS = [
  { type: 'FEATURED' as const, title: 'Featured Products', titleAr: 'المنتجات المميزة', sortOrder: 0, isVisible: true },
  { type: 'BEST_VALUE' as const, title: 'Best Value Deals', titleAr: 'أفضل العروض', sortOrder: 1, isVisible: true },
  { type: 'HOLIDAY_OFFERS' as const, title: 'Holiday Offers', titleAr: 'عروض الإجازات', sortOrder: 2, isVisible: false },
];

export async function initDefaultSections() {
  await requireAdmin();
  for (const def of BUILT_IN_DEFAULTS) {
    const existing = await prisma.homepageSection.findFirst({ where: { type: def.type } });
    if (!existing) {
      await prisma.homepageSection.create({ data: { ...def, productLimit: 10 } });
    }
  }
  revalidatePath('/admin/homepage');
  revalidatePath('/');
}

export async function toggleSectionVisibility(id: string, isVisible: boolean) {
  await requireAdmin();
  await prisma.homepageSection.update({ where: { id }, data: { isVisible } });
  revalidatePath('/');
  revalidatePath('/admin/homepage');
}

export async function updateSectionConfig(
  id: string,
  data: { title?: string; titleAr?: string; categoryId?: string | null; productLimit?: number }
) {
  await requireAdmin();
  await prisma.homepageSection.update({ where: { id }, data });
  revalidatePath('/');
  revalidatePath('/admin/homepage');
}

export async function moveSectionUp(id: string) {
  await requireAdmin();
  const sections = await prisma.homepageSection.findMany({ orderBy: { sortOrder: 'asc' } });
  const idx = sections.findIndex((s) => s.id === id);
  if (idx <= 0) return;
  const swapWith = sections[idx - 1];
  await prisma.$transaction([
    prisma.homepageSection.update({ where: { id }, data: { sortOrder: swapWith.sortOrder } }),
    prisma.homepageSection.update({ where: { id: swapWith.id }, data: { sortOrder: sections[idx].sortOrder } }),
  ]);
  revalidatePath('/');
  revalidatePath('/admin/homepage');
}

export async function moveSectionDown(id: string) {
  await requireAdmin();
  const sections = await prisma.homepageSection.findMany({ orderBy: { sortOrder: 'asc' } });
  const idx = sections.findIndex((s) => s.id === id);
  if (idx < 0 || idx >= sections.length - 1) return;
  const swapWith = sections[idx + 1];
  await prisma.$transaction([
    prisma.homepageSection.update({ where: { id }, data: { sortOrder: swapWith.sortOrder } }),
    prisma.homepageSection.update({ where: { id: swapWith.id }, data: { sortOrder: sections[idx].sortOrder } }),
  ]);
  revalidatePath('/');
  revalidatePath('/admin/homepage');
}

export async function addCategorySection(categoryId: string) {
  await requireAdmin();
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return { error: 'Category not found' };

  const existing = await prisma.homepageSection.findFirst({
    where: { type: 'CATEGORY_SHOWCASE', categoryId },
  });
  if (existing) return { error: 'This category already has a section' };

  const agg = await prisma.homepageSection.aggregate({ _max: { sortOrder: true } });
  await prisma.homepageSection.create({
    data: {
      type: 'CATEGORY_SHOWCASE',
      title: category.name,
      titleAr: category.nameAr ?? undefined,
      categoryId,
      productLimit: 10,
      sortOrder: (agg._max.sortOrder ?? 0) + 1,
      isVisible: true,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/homepage');
}

export async function deleteCategorySection(id: string) {
  await requireAdmin();
  const section = await prisma.homepageSection.findUnique({ where: { id } });
  if (!section || section.type !== 'CATEGORY_SHOWCASE') {
    return { error: 'Only category showcase sections can be deleted' };
  }
  await prisma.homepageSection.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/homepage');
}
