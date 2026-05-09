'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { applyCoupon } from '@/lib/server-actions/checkout';
import { useLocale } from '@/lib/i18n/context';

interface CouponInputProps {
  subtotalEgp: number;
  onApplied: (discount: { discountEgp: number; code: string }) => void;
  appliedCode?: string | null;
}

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
      <div className="flex items-center gap-2 p-3 bg-success/10 rounded-btn-sm border border-success/30">
        <span className="text-nav-sm font-medium text-success flex-1">
          {t.checkout.couponApplied(appliedCode)}
        </span>
        <button
          onClick={() => onApplied({ discountEgp: 0, code: '' })}
          className="text-xs text-text-secondary hover:text-text-primary"
        >
          {t.checkout.remove}
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        placeholder={t.checkout.couponPlaceholder}
        className="flex-1 h-10 px-3 border border-border-primary/40 rounded-btn-sm text-nav-sm text-text-primary bg-bg-white focus:outline-none focus:border-primary"
        aria-label={t.checkout.couponPlaceholder}
      />
      <button
        onClick={handleApply}
        disabled={loading || !code.trim()}
        className="px-4 h-10 bg-primary text-text-on-dark rounded-btn-sm text-xs font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors whitespace-nowrap"
      >
        {loading ? '…' : t.checkout.apply}
      </button>
    </div>
  );
}
