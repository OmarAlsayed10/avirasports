'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidateTag, revalidatePath } from 'next/cache';
import { adminProductSchema, type AdminProductInput } from '@/lib/validators/admin-product';
import { redirect } from 'next/navigation';
import { requireAdmin } from './_require-admin';
import { deleteCloudinaryAssets } from '@/lib/cloudinary';

export async function createProduct(data: AdminProductInput) {
  await requireAdmin();

  const parsed = adminProductSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { images, variants, specs, ...rest } = parsed.data;

  try {
    await prisma.product.create({
      data: {
        ...rest,
        specs,
        images: {
          create: images.map((img, i) => ({
            url: img.url,
            alt: img.alt || rest.name,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder ?? i,
          })),
        },
        variants: {
          create: variants.map((v) => ({
            sku: v.sku,
            attributes: v.attributes,
            priceOverrideEgp: v.priceOverrideEgp ?? null,
            stockCount: v.stockCount,
            imageUrl: v.imageUrl ?? null,
          })),
        },
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return { error: { slug: ['A product with this slug already exists.'] } };
    }
    throw e;
  }

  revalidateTag('products');
  redirect('/admin/products');
}

export async function updateProduct(id: string, data: AdminProductInput) {
  await requireAdmin();

  const parsed = adminProductSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { images, variants, specs, ...rest } = parsed.data;

  const newImageUrls = new Set(images.map((img) => img.url));

  const oldImages = await prisma.productImage.findMany({
    where: { productId: id },
    select: { url: true },
  });
  const removedImageUrls = oldImages.map((img) => img.url).filter((url) => !newImageUrls.has(url));

  try {
  await prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: id } });

    const currentVariants = await tx.productVariant.findMany({
      where: { productId: id },
      include: { orderItems: { take: 1 } },
    });

    const formVariantIds = new Set(variants.filter((v) => v.id).map((v) => v.id!));
    const toDelete = currentVariants.filter(
      (v) => !formVariantIds.has(v.id) && v.orderItems.length === 0
    );
    if (toDelete.length > 0) {
      await tx.productVariant.deleteMany({ where: { id: { in: toDelete.map((v) => v.id) } } });
    }

    await tx.product.update({
      where: { id },
      data: {
        ...rest,
        specs,
        images: {
          create: images.map((img, i) => ({
            url: img.url,
            alt: img.alt || rest.name,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder ?? i,
          })),
        },
      },
    });

    for (const v of variants) {
      if (v.id) {
        await tx.productVariant.update({
          where: { id: v.id },
          data: {
            sku: v.sku,
            attributes: v.attributes,
            priceOverrideEgp: v.priceOverrideEgp ?? null,
            stockCount: v.stockCount,
            imageUrl: v.imageUrl ?? null,
          },
        });
      } else {
        await tx.productVariant.create({
          data: {
            productId: id,
            sku: v.sku,
            attributes: v.attributes,
            priceOverrideEgp: v.priceOverrideEgp ?? null,
            stockCount: v.stockCount,
            imageUrl: v.imageUrl ?? null,
          },
        });
      }
    }
  });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return { error: { slug: ['A product with this slug already exists.'] } };
    }
    throw e;
  }

  if (removedImageUrls.length > 0) {
    await deleteCloudinaryAssets(removedImageUrls);
  }

  revalidateTag('products');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  const images = await prisma.productImage.findMany({
    where: { productId: id },
    select: { url: true },
  });

  await prisma.product.delete({ where: { id } });

  if (images.length > 0) {
    await deleteCloudinaryAssets(images.map((img) => img.url));
  }

  revalidateTag('products');
  revalidatePath('/admin/products');
}

export async function toggleProductStatus(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { isActive } });
  revalidateTag('products');
  revalidatePath('/admin/products');
}
