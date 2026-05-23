'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { applyCoupon } from '@/modules/checkout/checkout.service';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { couponInputTokens } from './coupon-input.tokens';
import type { CouponInputProps } from './coupon-input.types';

export function CouponInput({ subtotalEgp, onApplied, appliedCode }: CouponInputProps) {
  const { t } = useLocale();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    try {
      const result = await applyCoupon(trimmed, subtotalEgp);
      if (result.ok) {
        onApplied({ discountEgp: result.data.discountEgp, code: trimmed });
        toast.success(t.checkout.couponSaved(result.data.discountEgp));
        setCode('');
      } else {
        toast.error(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (appliedCode) {
    return (
      <div className={couponInputTokens.appliedWrapper}>
        <span className={couponInputTokens.appliedText}>
          {t.checkout.couponApplied(appliedCode)}
        </span>
        <button
          onClick={() => onApplied({ discountEgp: 0, code: '' })}
          className={couponInputTokens.removeBtn}
        >
          {t.checkout.remove}
        </button>
      </div>
    );
  }

  return (
    <div className={couponInputTokens.formRow}>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        placeholder={t.checkout.couponPlaceholder}
        className={couponInputTokens.input}
        aria-label={t.checkout.couponPlaceholder}
      />
      <button
        onClick={handleApply}
        disabled={loading || !code.trim()}
        className={couponInputTokens.applyBtn}
      >
        {loading ? '…' : t.checkout.apply}
      </button>
    </div>
  );
}
