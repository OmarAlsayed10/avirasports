'use client';

import { useEffect, useState } from 'react';
import { X, Tag } from 'lucide-react';
import type { Locale } from '@/modules/_shared/i18n/locale';
import { productTokens } from '../product.tokens';
import { tr } from '@/modules/_shared/i18n/i18n.translations';

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

  const p = productTokens.quantityOffer.popup;
  const t = tr(locale).product;
  const numLocale = locale === 'ar' ? 'ar-EG' : undefined;

  return (
    <div
      className={p.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className={p.panel}>
        <button onClick={handleClose} aria-label="Close offer popup" className={p.closeBtn}>
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className={p.iconWrapper}>
            <Tag className={p.icon} />
          </div>
          <div>
            <p className={p.eyebrow}>{t.limitedTimeOffer}</p>
            <p className={p.productName}>{productName}</p>
          </div>
        </div>

        <div className="space-y-3">
          {offers.map((offer) => {
            const normalTotal = basePrice * offer.quantity;
            const savings = normalTotal - offer.offerPriceEgp;
            return (
              <div key={offer.id} className={p.offerCard}>
                <p className={p.offerTitle}>
                  {t.buyNForPrice(offer.quantity, offer.offerPriceEgp.toLocaleString(numLocale))}
                </p>
                {savings > 0 && (
                  <p className={p.offerSavings}>
                    {t.insteadOfSave(normalTotal.toLocaleString(numLocale), savings.toLocaleString(numLocale))}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={handleClose} className={p.ctaBtn}>
          {t.shopNow}
        </button>
      </div>
    </div>
  );
}
