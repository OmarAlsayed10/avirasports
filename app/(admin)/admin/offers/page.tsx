import Link from 'next/link';
import type { Metadata } from 'next';
import { listOffersAdmin } from '@/lib/queries/offers';
import { getT } from '@/lib/locale';
import OfferRowActions from '@/components/admin/offers/offer-row-actions';

export const metadata: Metadata = { title: 'Offers' };

export default async function AdminOffersPage() {
  const { locale, t } = getT();
  const isAr = locale === 'ar';
  const offers = await listOffersAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{t.admin.offers}</h1>
        <Link
          href="/admin/offers/new"
          className="px-4 py-2 bg-primary-btn text-white text-sm font-semibold rounded-md hover:bg-primary-btn/90 transition-colors"
        >
          {t.admin.addOffer}
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                {t.admin.offerTriggers}
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">
                {t.admin.offerType}
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                {t.admin.offerReward}
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">
                {t.admin.status}
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-700 text-sm">
                  {offer.triggers
                    .map((trig) =>
                      isAr && (trig.product as any).nameAr
                        ? (trig.product as any).nameAr
                        : trig.product.name
                    )
                    .join(', ')}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {offer.rewardType === 'GIFT' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                      {t.admin.offerFreeGift}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      {offer.discountPercent}% {t.admin.offerPercentOff}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-700 text-sm">
                  {isAr && (offer.rewardProduct as any).nameAr
                    ? (offer.rewardProduct as any).nameAr
                    : offer.rewardProduct.name}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      offer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {offer.isActive ? t.admin.active : t.admin.inactive}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <OfferRowActions id={offer.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {offers.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">{t.admin.noOffersYet}</div>
        )}
      </div>
    </div>
  );
}
