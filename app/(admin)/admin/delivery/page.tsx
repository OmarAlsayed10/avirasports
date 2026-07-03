import type { Metadata } from 'next';
import { getDeliveryZones } from '@/modules/checkout/delivery.service';
import { DeliveryEditor } from '@/modules/admin/settings/components/delivery-editor';
import { getT } from '@/modules/_shared/i18n/locale';

export const metadata: Metadata = { title: 'Delivery Fees' };

export default async function DeliveryAdminPage() {
  const zones = await getDeliveryZones();
  const { t } = getT();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{t.admin.deliveryHeading}</h1>
        <p className="text-sm text-gray-500 mt-1">{t.admin.deliverySub}</p>
      </div>

      <DeliveryEditor initialZones={zones} />
    </div>
  );
}
