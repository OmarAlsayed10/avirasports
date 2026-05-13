import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

export const getProductOffers = unstable_cache(
  async (productId: string) => {
    return prisma.offer.findMany({
      where: { isActive: true, triggers: { some: { productId } } },
      include: {
        rewardProduct: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            slug: true,
            images: { where: { isPrimary: true }, take: 1, select: { url: true, alt: true } },
          },
        },
        triggers: {
          include: {
            product: { select: { id: true, name: true, nameAr: true, slug: true } },
          },
        },
      },
    });
  },
  ['product-offers'],
  { tags: ['offers'], revalidate: 60 }
);

export type ProductOffer = Awaited<ReturnType<typeof getProductOffers>>[number];

export async function listOffersAdmin() {
  return prisma.offer.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      rewardProduct: { select: { id: true, name: true, nameAr: true } },
      triggers: { include: { product: { select: { id: true, name: true, nameAr: true } } } },
    },
  });
}
