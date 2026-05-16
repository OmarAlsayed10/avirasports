import Link from 'next/link';
import { getT } from '@/modules/_shared/i18n/locale';
import { notFoundTokens as tk } from '@/modules/_shared/tokens/not-found.tokens';

export default function NotFound() {
  const { t } = getT();

  return (
    <div className={tk.root}>
      <p className={tk.code} aria-hidden="true">404</p>
      <h1 className={tk.heading}>{t.notFound.heading}</h1>
      <p className={tk.sub}>{t.notFound.sub}</p>
      <div className={tk.actions}>
        <Link href="/" className={tk.primaryBtn}>{t.notFound.goHome}</Link>
        <Link href="/shop" className={tk.secondaryBtn}>{t.notFound.browseShop}</Link>
      </div>
    </div>
  );
}
