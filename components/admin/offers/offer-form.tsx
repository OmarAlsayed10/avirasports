'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createOffer, updateOffer } from '@/lib/server-actions/admin/offers';
import { useLocale } from '@/lib/i18n/context';
import type { AdminOfferInput } from '@/lib/validators/admin-offer';

interface Product {
  id: string;
  name: string;
  nameAr?: string | null;
}

interface OfferFormProps {
  products: Product[];
  initialData?: {
    id: string;
    isActive: boolean;
    rewardType: 'GIFT' | 'PERCENT_OFF';
    discountPercent: number | null;
    rewardProductId: string;
    triggerProductIds: string[];
  };
}

export function OfferForm({ products, initialData }: OfferFormProps) {
  const isEdit = !!initialData;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { locale, t } = useLocale();

  const [rewardType, setRewardType] = useState<'GIFT' | 'PERCENT_OFF'>(
    initialData?.rewardType ?? 'GIFT'
  );
  const [discountPercent, setDiscountPercent] = useState<string>(
    initialData?.discountPercent?.toString() ?? ''
  );
  const [rewardProductId, setRewardProductId] = useState(initialData?.rewardProductId ?? '');
  const [triggerProductIds, setTriggerProductIds] = useState<string[]>(
    initialData?.triggerProductIds ?? []
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  function productLabel(p: Product) {
    return locale === 'ar' && p.nameAr ? p.nameAr : p.name;
  }

  function toggleTrigger(id: string) {
    setTriggerProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const data: AdminOfferInput = {
      isActive,
      rewardType,
      discountPercent: rewardType === 'PERCENT_OFF' ? Number(discountPercent) : null,
      rewardProductId,
      triggerProductIds,
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateOffer(initialData.id, data)
        : await createOffer(data);

      if (result?.error) {
        setErrors(result.error as Record<string, string[]>);
      }
    });
  }

  const inputCls =
    'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
  const errorCls = 'text-xs text-red-600 mt-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Reward Type */}
      <div>
        <p className={labelCls}>{t.admin.offerType} *</p>
        <div className="flex gap-4">
          {(['GIFT', 'PERCENT_OFF'] as const).map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rewardType"
                value={type}
                checked={rewardType === type}
                onChange={() => setRewardType(type)}
                className="accent-primary"
              />
              <span className="text-sm text-gray-700">
                {type === 'GIFT' ? t.admin.offerFreeGift : t.admin.offerPercentOff}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Trigger Products */}
      <div>
        <p className={labelCls}>
          {t.admin.offerTriggers} * —{' '}
          <span className="font-normal text-gray-500">{t.admin.offerTriggersHint}</span>
        </p>
        <div className="border border-gray-200 rounded-md max-h-48 overflow-y-auto divide-y divide-gray-100">
          {products.map((p) => (
            <label key={p.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={triggerProductIds.includes(p.id)}
                onChange={() => toggleTrigger(p.id)}
                className="accent-primary"
              />
              <span className="text-sm text-gray-700">{productLabel(p)}</span>
            </label>
          ))}
        </div>
        {errors.triggerProductIds && <p className={errorCls}>{errors.triggerProductIds[0]}</p>}
      </div>

      {/* Reward Product */}
      <div>
        <label className={labelCls}>{t.admin.offerReward} *</label>
        <select
          value={rewardProductId}
          onChange={(e) => setRewardProductId(e.target.value)}
          className={inputCls}
        >
          <option value="">{t.admin.selectRewardProduct}</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {productLabel(p)}
            </option>
          ))}
        </select>
        {errors.rewardProductId && <p className={errorCls}>{errors.rewardProductId[0]}</p>}
      </div>

      {/* Discount Percent */}
      {rewardType === 'PERCENT_OFF' && (
        <div>
          <label className={labelCls}>{t.admin.offerDiscountPercent} *</label>
          <input
            type="number"
            min={1}
            max={99}
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            placeholder="e.g. 50"
            className={inputCls}
          />
          {errors.discountPercent && <p className={errorCls}>{errors.discountPercent[0]}</p>}
        </div>
      )}

      {/* Active */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="accent-primary w-4 h-4"
        />
        <span className="text-sm text-gray-700">{t.admin.offerActive}</span>
      </label>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-primary-btn text-white text-sm font-semibold rounded-md hover:bg-primary-btn/90 disabled:opacity-60 transition-colors"
        >
          {isPending ? t.admin.saving : isEdit ? t.admin.updateOffer : t.admin.createOffer}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/offers')}
          className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-200 transition-colors"
        >
          {t.admin.cancel}
        </button>
      </div>
    </form>
  );
}
