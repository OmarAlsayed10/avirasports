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
  const removedImageUrls = oldImages.map((i) => i.url).filter((url) => !newImageUrls.has(url));

  const toUpdate = variants.filter((v) => v.id);
  const toCreate = variants.filter((v) => !v.id);

  try {
    await prisma.productImage.deleteMany({ where: { productId: id } });

    const currentVariants = await prisma.productVariant.findMany({
      where: { productId: id },
      include: { orderItems: { take: 1 } },
    });

    const formVariantIds = new Set(toUpdate.map((v) => v.id!));
    const toDelete = currentVariants.filter(
      (v) => !formVariantIds.has(v.id) && v.orderItems.length === 0
    );
    if (toDelete.length > 0) {
      await prisma.productVariant.deleteMany({
        where: { id: { in: toDelete.map((v) => v.id) } },
      });
    }

    await prisma.product.update({
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

    if (toUpdate.length > 0) {
      await prisma.$executeRaw`
        UPDATE "ProductVariant" AS pv
        SET
          sku                = v.sku,
          attributes         = v.attributes::jsonb,
          "priceOverrideEgp" = v.price::numeric,
          "stockCount"       = v.stock::int,
          "imageUrl"         = v.image
        FROM unnest(
          ${toUpdate.map((v) => v.id)}::text[],
          ${toUpdate.map((v) => v.sku)}::text[],
          ${toUpdate.map((v) => JSON.stringify(v.attributes))}::text[],
          ${toUpdate.map((v) => v.priceOverrideEgp?.toString() ?? null)}::text[],
          ${toUpdate.map((v) => v.stockCount)}::int[],
          ${toUpdate.map((v) => v.imageUrl ?? null)}::text[]
        ) AS v(id, sku, attributes, price, stock, image)
        WHERE pv.id = v.id::text
      `;
    }

    if (toCreate.length > 0) {
      await prisma.productVariant.createMany({
        data: toCreate.map((v) => ({
          productId: id,
          sku: v.sku,
          attributes: v.attributes,
          priceOverrideEgp: v.priceOverrideEgp ?? null,
          stockCount: v.stockCount,
          imageUrl: v.imageUrl ?? null,
        })),
      });
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return { error: { slug: ['A product with this slug already exists.'] } };
    }
    throw e;
  }

  if (removedImageUrls.length > 0) await deleteCloudinaryAssets(removedImageUrls);

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