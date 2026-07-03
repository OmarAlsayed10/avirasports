'use client';

import { useState, useTransition } from 'react';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { GOVERNORATES, GOVERNORATE_NAMES_AR, type Governorate } from '@/modules/_shared/constants/governorates.constants';
import type { DeliveryZone } from '@/modules/_shared/constants/delivery-zones.constants';
import { saveDeliveryZones } from '@/modules/checkout/delivery.service';

export function DeliveryEditor({ initialZones }: { initialZones: DeliveryZone[] }) {
  const { t } = useLocale();
  const isAr = t.dir === 'rtl';
  const [zones, setZones] = useState<DeliveryZone[]>(initialZones);
  const [isPending, startTransition] = useTransition();

  const patchZone = (id: string, patch: Partial<DeliveryZone>) =>
    setZones((zs) => zs.map((z) => (z.id === id ? { ...z, ...patch } : z)));

  const addZone = () =>
    setZones((zs) => [
      ...zs,
      { id: crypto.randomUUID(), labelEn: '', labelAr: '', feeEgp: 0, governorates: [] },
    ]);

  const removeZone = (id: string) => setZones((zs) => zs.filter((z) => z.id !== id));

  // Move a governorate so it belongs only to the chosen zone (or none).
  const assign = (gov: Governorate, zoneId: string) =>
    setZones((zs) =>
      zs.map((z) => ({
        ...z,
        governorates: z.governorates.filter((g) => g !== gov).concat(z.id === zoneId ? [gov] : []),
      }))
    );

  const zoneOf = (gov: Governorate) => zones.find((z) => z.governorates.includes(gov))?.id ?? '';

  const save = () =>
    startTransition(async () => {
      const res = await saveDeliveryZones(zones);
      if (res.ok) toast.success(t.admin.deliverySaved);
      else toast.error(res.error);
    });

  return (
    <div className="space-y-8">
      {/* Zones */}
      <div className="space-y-3">
        {zones.map((z) => (
          <div key={z.id} className="flex flex-wrap items-end gap-3 p-4 border border-gray-200 rounded-lg bg-white">
            <label className="flex flex-col gap-1 flex-1 min-w-[160px]">
              <span className="text-xs text-gray-500">{t.admin.zoneNameEn}</span>
              <input
                value={z.labelEn}
                onChange={(e) => patchZone(z.id, { labelEn: e.target.value })}
                className="field-input"
              />
            </label>
            <label className="flex flex-col gap-1 flex-1 min-w-[160px]">
              <span className="text-xs text-gray-500">{t.admin.zoneNameAr}</span>
              <input
                value={z.labelAr}
                dir="rtl"
                onChange={(e) => patchZone(z.id, { labelAr: e.target.value })}
                className="field-input"
              />
            </label>
            <label className="flex flex-col gap-1 w-28">
              <span className="text-xs text-gray-500">{t.admin.zoneFee}</span>
              <input
                type="number"
                min={0}
                value={z.feeEgp}
                onChange={(e) => patchZone(z.id, { feeEgp: Number(e.target.value) })}
                className="field-input"
              />
            </label>
            <button
              type="button"
              onClick={() => removeZone(z.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
              aria-label={t.admin.delete}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addZone}
          className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
        >
          <Plus className="w-4 h-4" />
          {t.admin.addZone}
        </button>
      </div>

      {/* Governorate → zone assignment */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">{t.admin.assignGovernorates}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {GOVERNORATES.map((g) => (
            <label key={g} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-gray-700">{isAr ? GOVERNORATE_NAMES_AR[g] : g}</span>
              <select
                value={zoneOf(g)}
                onChange={(e) => assign(g, e.target.value)}
                className="field-input py-1.5 max-w-[55%]"
              >
                <option value="">{t.admin.unassignedZone}</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {isAr ? z.labelAr || z.labelEn : z.labelEn || z.labelAr}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={isPending}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-md text-sm font-semibold disabled:opacity-60 hover:opacity-90 transition-opacity"
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {isPending ? t.admin.saving : t.admin.save}
      </button>
    </div>
  );
}
