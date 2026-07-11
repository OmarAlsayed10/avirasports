import { unstable_cache } from 'next/cache';
import { prisma } from '@/infrastructure/db/prisma';
import type { ProductFilters } from '@/modules/product/product.validators';

export const listProducts = unstable_cache(
  async (filters: Partial<ProductFilters>) => {
    const {
      category,
      brand,
      priceMin,
      priceMax,
      rating,
      inStockOnly,
      onSale,
      sort = 'featured',
      page = 1,
      limit = 24,
    } = filters;

    const where = {
      isActive: true,
      ...(category && { category: { slug: category } }),
      ...(brand && { brand: { contains: brand, mode: 'insensitive' as const } }),
      ...(priceMin !== undefined && { basePriceEgp: { gte: priceMin } }),
      ...(priceMax !== undefined && { basePriceEgp: { lte: priceMax } }),
      ...(rating !== undefined && { ratingAvg: { gte: rating } }),
      ...(inStockOnly && { variants: { some: { stockCount: { gt: 0 } } } }),
      ...(onSale && { discountPercent: { not: null } }),
    };

    const orderBy =
      sort === 'price_asc'
        ? { basePriceEgp: 'asc' as const }
        : sort === 'price_desc'
          ? { basePriceEgp: 'desc' as const }
          : sort === 'newest'
            ? { createdAt: 'desc' as const }
            : sort === 'rating'
              ? { ratingAvg: 'desc' as const }
              : { isFeatured: 'desc' as const };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          variants: { select: { stockCount: true } },
          category: { select: { slug: true, name: true, nameAr: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, limit };
  },
  ['list-products'],
  {
    revalidate: 300,
    tags: ['products'],
  }
);

export const getProduct = unstable_cache(
  async (slug: string) => {
    return prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { sortOrder: 'asc' as const } },
        variants: true,
        category: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true, image: true } } },
        },
      },
    });
  },
  ['get-product'],
  { revalidate: 300, tags: ['products'] }
);

export const getRelatedProducts = unstable_cache(
  async (productId: string, categoryId: string, limit = 4) => {
    return prisma.product.findMany({
      where: { categoryId, id: { not: productId }, isActive: true },
      take: limit,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: { select: { stockCount: true } },
      },
    });
  },
  ['get-related-products'],
  { revalidate: 300, tags: ['products'] }
);

export const getBestSellers = unstable_cache(
  async (limit = 4, excludeProductId?: string) => {
  const topItems = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    where: excludeProductId ? { productId: { not: excludeProductId } } : undefined,
    take: limit * 3,
  });

  if (topItems.length === 0) return [];

  const ranked = topItems.map((i:any) => i.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: ranked }, isActive: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      variants: { select: { stockCount: true } },
    },
  });

    return ranked
      .map((id:any) => products.find((p:any) => p.id === id))
      .filter((p:any): p is NonNullable<typeof p> => p != null)
      .slice(0, limit);
  },
  ['get-best-sellers'],
  { revalidate: 300, tags: ['products'] }
);

export const getAlsoBought = unstable_cache(
  async (productId: string, limit = 4) => {
  const orderItems = await prisma.orderItem.findMany({
    where: { productId },
    select: { orderId: true },
    distinct: ['orderId'],
    take: 200,
  });

  if (orderItems.length === 0) return [];

  const orderIds = orderItems.map((i:any) => i.orderId);

  const coItems = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: { orderId: { in: orderIds }, productId: { not: productId } },
    _count: { productId: true },
    orderBy: { _count: { productId: 'desc' } },
    take: limit * 2,
  });

  if (coItems.length === 0) return [];

  const ranked = coItems.map((i:any) => i.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: ranked }, isActive: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      variants: { select: { stockCount: true } },
    },
  });

  return ranked
    .map((id:any) => products.find((p:any) => p.id === id))
    .filter((p:any): p is NonNullable<typeof p> => p != null)
    .slice(0, limit);
  },
  ['get-also-bought'],
  { revalidate: 300, tags: ['products'] }
);

export async function getUserProductReview(productId: string, userId: string) {
  return prisma.review.findUnique({
    where: { productId_userId: { productId, userId } },
    select: { id: true, rating: true },
  });
}

export async function getFeaturedProducts(limit = 12) {
  return prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    take: limit,
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });
}
