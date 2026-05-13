import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getT } from '@/lib/locale';
import { OfferForm } from '@/components/admin/offers/offer-form';

export const metadata: Metadata = { title: 'Edit Offer' };

interface Props {
  params: { id: string };
}

export default async function EditOfferPage({ params }: Props) {
  const { t } = getT();
  const [offer, products] = await Promise.all([
    prisma.offer.findUnique({
      where: { id: params.id },
      include: { triggers: { select: { productId: true } } },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, nameAr: true },
    }),
  ]);

  if (!offer) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{t.admin.editOffer}</h1>
      <OfferForm
        products={products}
        initialData={{
          id: offer.id,
          isActive: offer.isActive,
          rewardType: offer.rewardType,
          discountPercent: offer.discountPercent,
          rewardProductId: offer.rewardProductId,
          triggerProductIds: offer.triggers.map((t) => t.productId),
        }}
      />
    </div>
  );
}
