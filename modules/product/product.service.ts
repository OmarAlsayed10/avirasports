'use server';

import { prisma } from '@/infrastructure/db/prisma';
import { Prisma } from '@prisma/client';
import { revalidateTag, revalidatePath } from 'next/cache';
import { adminProductSchema, type AdminProductInput } from '@/modules/product/product.validators';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/modules/admin/_shared/require-admin';
import { deleteCloudinaryAssets } from '@/infrastructure/storage/cloudinary';
import { getT } from '@/modules/_shared/i18n/locale';

type ProductCategoryError = { categoryId: string[] } | { variants: string[] };

async function productCategoryError(input: AdminProductInput): Promise<ProductCategoryError | null> {
  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
    select: { hasMultipleSizes: true },
  });
  const { t } = getT();

  if (!category) return { categoryId: [t.admin.categoryNotFound] };
  if (category.hasMultipleSizes) return null;

  const sizes = new Set(input.variants.map((variant) => variant.attributes.size).filter(Boolean));
  return sizes.size > 1 ? { variants: [t.admin.oneSizeCategoryError] } : null;
}

export async function createProduct(data: AdminProductInput) {
  await requireAdmin();

  const parsed = adminProductSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const categoryError = await productCategoryError(parsed.data);
  if (categoryError) return { error: categoryError };

  const { images, variants, specs, quantityOffers, ...rest } = parsed.data;

  try {
    const product = await prisma.product.create({
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

    if (quantityOffers.length > 0) {
      try {
        await prisma.productQuantityOffer.createMany({
          data: quantityOffers.map((qo) => ({
            productId: product.id,
            quantity: qo.quantity,
            offerPriceEgp: qo.offerPriceEgp,
            isActive: qo.isActive,
            popupIntervalMinutes: qo.popupIntervalMinutes,
          })),
        });
      } catch (e) {
        if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2021')) throw e;
      }
    }
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

  const categoryError = await productCategoryError(parsed.data);
  if (categoryError) return { error: categoryError };

  const { images, variants, specs, quantityOffers, ...rest } = parsed.data;

  const newImageUrls = new Set(images.map((img) => img.url));
  const oldImages = await prisma.productImage.findMany({
    where: { productId: id },
    select: { url: true },
  });
  const removedImageUrls = oldImages.map((i) => i.url).filter((url) => !newImageUrls.has(url));

  const toUpdate = variants.filter((v) => v.id);
  const toCreate = variants.filter((v) => !v.id);

  try {
    // One transaction on a single connection: sequential writes avoid exhausting the
    // pool (connection_limit=1) and keep the whole save atomic — no partial updates.
    await prisma.$transaction(
      async (tx) => {
        await tx.productImage.deleteMany({ where: { productId: id } });

        const currentVariants = await tx.productVariant.findMany({
          where: { productId: id },
          include: { orderItems: { take: 1 } },
        });

        const formVariantIds = new Set(toUpdate.map((v) => v.id!));
        const toDelete = currentVariants.filter(
          (v) => !formVariantIds.has(v.id) && v.orderItems.length === 0
        );
        if (toDelete.length > 0) {
          await tx.productVariant.deleteMany({
            where: { id: { in: toDelete.map((v) => v.id) } },
          });
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

        for (const v of toUpdate) {
          await tx.productVariant.update({
            where: { id: v.id! },
            data: {
              sku: v.sku,
              attributes: v.attributes,
              priceOverrideEgp: v.priceOverrideEgp ?? null,
              stockCount: v.stockCount,
              imageUrl: v.imageUrl ?? null,
            },
          });
        }

        if (toCreate.length > 0) {
          await tx.productVariant.createMany({
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

        await tx.productQuantityOffer.deleteMany({ where: { productId: id } });
        if (quantityOffers.length > 0) {
          await tx.productQuantityOffer.createMany({
            data: quantityOffers.map((qo: typeof quantityOffers[number]) => ({
              productId: id,
              quantity: qo.quantity,
              offerPriceEgp: qo.offerPriceEgp,
              isActive: qo.isActive,
              popupIntervalMinutes: qo.popupIntervalMinutes,
            })),
          });
        }
      },
      { timeout: 15000 }
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      const target = (e.meta?.target as string[] | undefined)?.join(',') ?? '';
      if (target.includes('sku')) {
        return { error: { variants: ['Duplicate SKU — each variant needs a unique SKU.'] } };
      }
      return { error: { slug: ['A product with this slug already exists.'] } };
    }
    console.error('[updateProduct] failed:', e);
    return { error: { slug: ['Could not save the product. Please try again.'] } };
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
