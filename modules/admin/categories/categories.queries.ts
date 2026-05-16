import { unstable_cache } from 'next/cache';
import { prisma } from '@/infrastructure/db/prisma';

export const listCategories = unstable_cache(
  () => prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
  ['categories'],
  { revalidate: 300, tags: ['categories'] },
);

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}
