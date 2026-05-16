'use server';

import { prisma } from '@/infrastructure/db/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/modules/admin/_shared/require-admin';

const brandSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
});

export async function createBrand(_: unknown, formData: FormData) {
  await requireAdmin();

  const parsed = brandSchema.safeParse({ name: formData.get('name') });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const slug = parsed.data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const exists = await prisma.brand.findFirst({ where: { OR: [{ name: parsed.data.name }, { slug }] } });
  if (exists) return { error: { name: ['A brand with this name already exists'] } };

  await prisma.brand.create({ data: { name: parsed.data.name, slug } });
  revalidatePath('/admin/brands');
  return { success: true };
}

export async function deleteBrand(id: string) {
  await requireAdmin();
  await prisma.brand.delete({ where: { id } });
  revalidatePath('/admin/brands');
  return { success: true };
}
