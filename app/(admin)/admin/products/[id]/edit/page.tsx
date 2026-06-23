import { prisma } from '@/infrastructure/db/prisma';
import ProductForm from '@/modules/admin/products/components/product-form';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Edit Product' };

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!product) notFound();

  const existingQuantityOffers = await (
    (prisma as any).productQuantityOffer?.findMany({
      where: { productId: params.id },
      orderBy: { quantity: 'asc' },
    }) ?? Promise.resolve([])
  ).catch(() => []);

  const rawSpecs = product.specs;
  const specs = Array.isArray(rawSpecs)
    ? rawSpecs as { key: string; keyAr: string; value: string; valueAr: string }[]
    : Object.entries(rawSpecs as Record<string, string>).map(([key, value]) => ({
        key, keyAr: '', value, valueAr: '',
      }));

  const defaultValues = {
    name: product.name,
    nameAr: product.nameAr ?? '',
    brand: product.brand,
    gender: product.gender as 'ALL' | 'MALE' | 'FEMALE' | 'KIDS',
    modelNumber: product.modelNumber ?? '',
    slug: product.slug,
    description: product.description,
    descriptionAr: product.descriptionAr ?? '',
    specs,
    categoryId: product.categoryId,
    basePriceEgp: Number(product.basePriceEgp),
    discountPercent: product.discountPercent ?? null,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    })),
    variants: product.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      attributes: v.attributes as Record<string, string>,
      priceOverrideEgp: v.priceOverrideEgp ? Number(v.priceOverrideEgp) : null,
      stockCount: v.stockCount,
      imageUrl: v.imageUrl ?? null,
    })),
    quantityOffers: existingQuantityOffers.map((qo: {
      id: string;
      quantity: number;
      offerPriceEgp: unknown;
      isActive: boolean;
      popupIntervalMinutes: number;
    }) => ({
      id: qo.id,
      quantity: qo.quantity,
      offerPriceEgp: Number(qo.offerPriceEgp),
      isActive: qo.isActive,
      popupIntervalMinutes: qo.popupIntervalMinutes,
    })),
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Edit Product</h1>
      <p className="text-sm text-gray-400 mb-6">{product.name}</p>
      <ProductForm categories={categories} brands={brands} defaultValues={defaultValues} productId={product.id} />
    </div>
  );
}
