'use server';

import { z } from 'zod';
import { prisma } from '@/infrastructure/db/prisma';

const querySchema = z.string().min(1).max(100);

export async function searchProducts(query: string) {
  const parsed = querySchema.safeParse(query);
  if (!parsed.success) return { products: [], categories: [] };

  const q = parsed.data.trim();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { brand: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 6,
      select: {
        id: true,
        slug: true,
        name: true,
        brand: true,
        basePriceEgp: true,
        discountPercent: true,
        images: { take: 1, orderBy: { sortOrder: 'asc' as const }, select: { url: true, alt: true } },
        category: { select: { slug: true, name: true } },
      },
    }),
    prisma.category.findMany({
      where: { name: { contains: q, mode: 'insensitive' } },
      take: 3,
      select: { id: true, slug: true, name: true },
    }),
  ]);

  return {
    products: products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      priceEgp: Number(p.basePriceEgp),
      discountPercent: p.discountPercent,
      imageUrl: p.images[0]?.url ?? '/placeholder-product.jpg',
      imageAlt: p.images[0]?.alt ?? p.name,
      categorySlug: p.category?.slug ?? '',
    })),
    categories: categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
    })),
  };
}
