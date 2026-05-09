'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { subscribeNewsletter } from '@/lib/server-actions/newsletter';
import { useLocale } from '@/lib/i18n/context';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await subscribeNewsletter(email);
      if (result.ok) {
        setSubscribed(true);
        setEmail('');
        toast.success(t.home.subscribeSuccess);
      } else {
        toast.error(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10 md:py-14 bg-bg-page dark:bg-bg-dark" aria-label="Newsletter signup">
      <div className="max-w-content mx-auto px-site">
        <div className="bg-bg-white dark:bg-bg-surface rounded-card-lg shadow-newsletter px-4 sm:px-8 py-8 md:py-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-start">
            <h2 className="font-secondary text-2xl md:text-3xl font-black uppercase tracking-tight text-text-near-black dark:text-text-on-dark mb-2">
              {t.home.newsletterHeading}
            </h2>
            <p className="text-sm text-text-muted dark:text-text-footer-link leading-relaxed">
              {t.home.newsletterSub}
            </p>
          </div>

          {subscribed ? (
            <p className="text-sm font-semibold text-success flex-shrink-0">
              {t.home.subscribed}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.home.emailPlaceholder}
                required
                className="w-full sm:w-64 md:w-72 h-12 md:h-14 px-4 md:px-5 border border-border-primary/40 dark:border-white/20 rounded-input text-base text-text-primary dark:text-text-on-dark bg-bg-page dark:bg-bg-dark placeholder:text-text-placeholder dark:placeholder:text-text-footer-link focus:outline-none focus:border-primary"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 h-12 md:h-14 bg-primary text-text-on-dark rounded-input text-base font-semibold whitespace-nowrap disabled:opacity-60 hover:bg-primary/90 transition-colors"
              >
                {loading ? '…' : t.home.subscribe}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
