import { prisma } from '@/infrastructure/db/prisma';

const productSelect = {
  id: true,
  slug: true,
  name: true,
  nameAr: true,
  brand: true,
  basePriceEgp: true,
  discountPercent: true,
  ratingAvg: true,
  reviewCount: true,
  images: {
    where: { isPrimary: true },
    take: 1,
    select: { url: true, alt: true },
  },
  variants: { select: { stockCount: true } },
  category: { select: { slug: true, name: true } },
} as const;

export type HomepageSectionRow = Awaited<ReturnType<typeof getVisibleHomepageSections>>[number];

export async function getVisibleHomepageSections() {
  return prisma.homepageSection.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      category: { select: { slug: true, name: true, nameAr: true } },
    },
  });
}

export async function getAllHomepageSections() {
  return prisma.homepageSection.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      category: { select: { id: true, slug: true, name: true, nameAr: true } },
    },
  });
}

export async function getSectionProducts(section: HomepageSectionRow, limit = 10) {
  const take = section.productLimit ?? limit;

  if (section.type === 'FEATURED') {
    return prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take,
      orderBy: { createdAt: 'desc' },
      select: productSelect,
    });
  }

  if (section.type === 'BEST_VALUE') {
    return prisma.product.findMany({
      where: { isActive: true, variants: { some: { stockCount: { gt: 0 } } } },
      take,
      orderBy: { basePriceEgp: 'asc' },
      select: productSelect,
    });
  }

  if (section.type === 'HOLIDAY_OFFERS') {
    return prisma.product.findMany({
      where: { isHolidayOffer: true, isActive: true },
      take,
      orderBy: { createdAt: 'desc' },
      select: productSelect,
    });
  }

  if (section.type === 'CATEGORY_SHOWCASE' && section.categoryId) {
    return prisma.product.findMany({
      where: { categoryId: section.categoryId, isActive: true },
      take,
      orderBy: { isFeatured: 'desc' },
      select: productSelect,
    });
  }

  return [];
}
