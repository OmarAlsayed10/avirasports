'use client';

import { useEffect, useState } from 'react';
import { X, Tag } from 'lucide-react';
import type { Locale } from '@/lib/locale';

interface QuantityOffer {
  id: string;
  quantity: number;
  offerPriceEgp: number;
  popupIntervalMinutes: number;
}

interface QuantityOfferPopupProps {
  offers: QuantityOffer[];
  productId: string;
  productName: string;
  basePrice: number;
  locale: Locale;
}

export function QuantityOfferPopup({
  offers,
  productId,
  productName,
  basePrice,
  locale,
}: QuantityOfferPopupProps) {
  const [visible, setVisible] = useState(false);

  const intervalMinutes = Math.min(...offers.map((o) => o.popupIntervalMinutes));
  const storageKey = `avira_qty_popup_${productId}`;

  useEffect(() => {
    if (visible) return;

    const lastShown = localStorage.getItem(storageKey);
    const now = Date.now();
    const intervalMs = intervalMinutes * 60 * 1000;

    if (!lastShown) {
      setVisible(true);
      return;
    }

    const lastShownTime = parseInt(lastShown, 10);
    if (isNaN(lastShownTime) || now - lastShownTime >= intervalMs) {
      setVisible(true);
      return;
    }

    const remaining = intervalMs - (now - lastShownTime);
    const timer = setTimeout(() => setVisible(true), remaining);
    return () => clearTimeout(timer);
  }, [visible, storageKey, intervalMinutes]);

  function handleClose() {
    localStorage.setItem(storageKey, Date.now().toString());
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="relative w-full max-w-sm bg-bg-white dark:bg-bg-surface rounded-2xl shadow-2xl p-6 border border-border-primary/20">
        <button
          onClick={handleClose}
          aria-label="Close offer popup"
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5 text-primary dark:text-white/70" />
          </div>
          <div>
            <p className="text-xs font-semibold text-primary dark:text-white/60 uppercase tracking-wide">
              {locale === 'ar' ? 'عرض لفترة محدودة' : 'Limited Time Offer'}
            </p>
            <p className="text-sm font-semibold text-text-primary dark:text-text-on-dark line-clamp-1">
              {productName}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {offers.map((offer) => {
            const normalTotal = basePrice * offer.quantity;
            const savings = normalTotal - offer.offerPriceEgp;
            return (
              <div
                key={offer.id}
                className="rounded-xl bg-primary/5 dark:bg-white/5 border border-primary/20 dark:border-white/10 p-4"
              >
                <p className="text-base font-bold text-text-primary dark:text-text-on-dark">
                  {locale === 'ar'
                    ? `اشترِ ${offer.quantity} مقابل ${offer.offerPriceEgp.toLocaleString('ar-EG')} ج.م فقط!`
                    : `Buy ${offer.quantity} for only EGP ${offer.offerPriceEgp.toLocaleString()}!`}
                </p>
                {savings > 0 && (
                  <p className="text-sm text-text-secondary dark:text-text-on-dark/60 mt-1">
                    {locale === 'ar'
                      ? `بدلاً من ${normalTotal.toLocaleString('ar-EG')} ج.م — وفّر ${savings.toLocaleString('ar-EG')} ج.م`
                      : `Instead of EGP ${normalTotal.toLocaleString()} — save EGP ${savings.toLocaleString()}`}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          {locale === 'ar' ? 'تسوق الآن' : 'Shop Now'}
        </button>
      </div>
    </div>
  );
}
