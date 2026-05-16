import { prisma } from '@/infrastructure/db/prisma';
import ProductForm from '@/modules/admin/products/components/product-form';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'New Product' };

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Add Product</h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
