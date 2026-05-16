'use server';

import { prisma } from '@/infrastructure/db/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/modules/admin/_shared/require-admin';
import { deleteCloudinaryAsset } from '@/infrastructure/storage/cloudinary';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  nameAr: z.string().max(80).optional().nullable(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().max(300).optional().nullable(),
  iconUrl: z.string().min(1).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export async function createCategory(_: unknown, formData: FormData) {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get('name'),
    nameAr: formData.get('nameAr') || null,
    slug: formData.get('slug'),
    description: formData.get('description') || null,
    iconUrl: formData.get('iconUrl') || null,
    sortOrder: formData.get('sortOrder') || 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const exists = await prisma.category.findFirst({
    where: { OR: [{ name: parsed.data.name }, { slug: parsed.data.slug }] },
  });
  if (exists) {
    return { error: { name: ['A category with this name or slug already exists'] } };
  }

  await prisma.category.create({ data: parsed.data });
  revalidatePath('/admin/categories');
  return { success: true };
}

export async function updateCategory(_: unknown, formData: FormData) {
  await requireAdmin();

  const id = formData.get('id') as string;
  const parsed = categorySchema.safeParse({
    name: formData.get('name'),
    nameAr: formData.get('nameAr') || null,
    slug: formData.get('slug'),
    description: formData.get('description') || null,
    iconUrl: formData.get('iconUrl') || null,
    sortOrder: formData.get('sortOrder') || 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const conflict = await prisma.category.findFirst({
    where: {
      OR: [{ name: parsed.data.name }, { slug: parsed.data.slug }],
      NOT: { id },
    },
  });
  if (conflict) {
    return { error: { name: ['Another category with this name or slug already exists'] } };
  }

  const old = await prisma.category.findUnique({ where: { id }, select: { iconUrl: true } });

  await prisma.category.update({ where: { id }, data: parsed.data });

  if (old?.iconUrl && old.iconUrl !== parsed.data.iconUrl) {
    await deleteCloudinaryAsset(old.iconUrl);
  }

  revalidatePath('/admin/categories');
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return { error: `Cannot delete: ${productCount} product(s) are using this category.` };
  }

  const category = await prisma.category.findUnique({ where: { id }, select: { iconUrl: true } });

  await prisma.category.delete({ where: { id } });

  if (category?.iconUrl) {
    await deleteCloudinaryAsset(category.iconUrl);
  }

  revalidatePath('/admin/categories');
  return { success: true };
}
