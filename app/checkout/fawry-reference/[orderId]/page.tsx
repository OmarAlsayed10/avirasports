'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Copy, Check, RefreshCw, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/stores/cart-store';
import { useLocale } from '@/lib/i18n/context';

interface FawryReferencePageProps {
  params: { orderId: string };
}

export default function FawryReferencePage({ params }: FawryReferencePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  const { t } = useLocale();

  const fawryRefNumber = searchParams.get('ref') ?? '';
  const expiryAt = searchParams.get('expiry') ?? '';
  const orderNumber = searchParams.get('order') ?? '';

  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<string>('pending_payment');
  const [checking, setChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!expiryAt) return;
    const expiry = new Date(expiryAt).getTime();
    const tick = () => {
      const remaining = expiry - Date.now();
      if (remaining <= 0) {
        setTimeLeft(t.checkout.expired);
        return;
      }
      const h = Math.floor(remaining / 3_600_000);
      const m = Math.floor((remaining % 3_600_000) / 60_000);
      setTimeLeft(t.checkout.timeLeft(h, m));
    };
    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, [expiryAt, t]);

  const checkStatus = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch(`/api/fawry/status?orderId=${params.orderId}`);
      if (!res.ok) throw new Error('Failed to check status');
      const data = (await res.json()) as { status: string; orderNumber?: string };
      setStatus(data.status);
      if (data.status === 'paid') {
        toast.success(t.checkout.paymentConfirmed);
        router.push(`/checkout/success?orderNumber=${data.orderNumber ?? orderNumber}`);
      } else {
        toast.info(t.checkout.paymentPending);
      }
    } catch {
      toast.error(t.checkout.statusError);
    } finally {
      setChecking(false);
    }
  }, [params.orderId, router, orderNumber, t]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fawryRefNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const FAWRY_STEPS = [
    { step: 1, title: t.checkout.fawryStep1Title, desc: t.checkout.fawryStep1Desc },
    { step: 2, title: t.checkout.fawryStep2Title, desc: t.checkout.fawryStep2Desc },
    { step: 3, title: t.checkout.fawryStep3Title, desc: t.checkout.fawryStep3Desc },
  ];

  return (
    <div className="max-w-content mx-auto px-site py-12">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <ClipboardList className="w-8 h-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-section-heading font-semibold text-text-primary mb-2">
            {t.checkout.fawryTitle}
          </h1>
          {orderNumber && (
            <p className="text-nav-sm text-text-secondary">{t.account.orderNumber(orderNumber)}</p>
          )}
        </div>

        {/* Reference Number */}
        <div className="bg-bg-dark text-text-on-dark rounded-carousel p-6 text-center mb-6">
          <p className="text-xs text-text-footer-link mb-2">{t.checkout.fawryRefLabel}</p>
          <p className="text-4xl font-bold tracking-widest mb-3 font-secondary">
            {fawryRefNumber || '—'}
          </p>
          <button
            onClick={handleCopy}
            disabled={!fawryRefNumber}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-text-on-dark/10 hover:bg-text-on-dark/20 rounded-btn-sm text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            {copied ? t.checkout.copied : t.checkout.copyRef}
          </button>
          {timeLeft && (
            <p className="text-xs text-text-footer-link mt-3">
              {t.checkout.payWithin(timeLeft)}
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-bg-white rounded-carousel border border-border-primary/20 p-6 mb-6 space-y-4">
          <h2 className="text-nav-sm font-semibold text-text-primary">{t.checkout.howToPay}</h2>
          {FAWRY_STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-text-on-dark flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {step}
              </div>
              <div>
                <p className="text-nav-sm font-semibold text-text-primary">{title}</p>
                <p className="text-xs text-text-secondary">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-text-secondary mb-4">
          {t.checkout.emailSent}
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={checkStatus}
            disabled={checking || status === 'paid'}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary-btn text-text-on-dark rounded-btn-sm text-nav-sm font-semibold disabled:opacity-60 hover:bg-primary transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            {checking ? t.checkout.checking : t.checkout.checkStatus}
          </button>
          <a
            href="/shop"
            className="block w-full text-center py-3 border border-border-primary rounded-btn-sm text-nav-sm font-medium text-text-primary hover:bg-bg-page transition-colors"
          >
            {t.checkout.continueShopping}
          </a>
        </div>
      </div>
    </div>
  );
}
