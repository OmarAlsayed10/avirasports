'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { subscribeNewsletter } from '@/modules/newsletter/newsletter.service';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { homeTokens } from '../home.tokens';

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
    <section className={homeTokens.newsletter.section} aria-label="Newsletter signup">
      <div className={homeTokens.newsletter.inner}>
        <div className={homeTokens.newsletter.card}>
          <div className={homeTokens.newsletter.textBlock}>
            <h2 className={homeTokens.newsletter.heading}>{t.home.newsletterHeading}</h2>
            <p className={homeTokens.newsletter.sub}>{t.home.newsletterSub}</p>
          </div>

          {subscribed ? (
            <p className={homeTokens.newsletter.successMsg}>{t.home.subscribed}</p>
          ) : (
            <form onSubmit={handleSubmit} className={homeTokens.newsletter.form}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.home.emailPlaceholder}
                required
                className={homeTokens.newsletter.input}
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={loading}
                className={homeTokens.newsletter.submitBtn}
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
