import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getT } from '@/lib/locale';
import { OfferForm } from '@/components/admin/offers/offer-form';

export const metadata: Metadata = { title: 'New Offer' };

export default async function NewOfferPage() {
  const { t } = getT();
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, nameAr: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{t.admin.newOffer}</h1>
      <OfferForm products={products} />
    </div>
  );
}
