import type { Metadata } from 'next';
import { DM_Sans, Barlow_Condensed, Cairo } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { Providers } from './providers';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { SearchOverlay } from '@/modules/search/components/search-overlay';
import { ScrollToTop } from '@/modules/_shared/ui/scroll-to-top';
import { getLocale } from '@/modules/_shared/i18n/locale';
import { auth } from '@/infrastructure/auth/auth.config';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'https://Avira.eg'),
  title: {
    default: 'Avira — Move Free',
    template: '%s | Avira',
  },
  description:
    'Shop premium sports gear and athletic apparel in Egypt — running, training, cycling, swimming, yoga, and football. Free delivery & easy returns.',
  keywords: [
    'sports gear Egypt',
    'athletic apparel Egypt',
    'running shoes Egypt',
    'training equipment Egypt',
    'sportswear Egypt',
    'Fawry payment',
    'free delivery Egypt',
  ],
  authors: [{ name: 'Avira' }],
  creator: 'Avira',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_EG',
    siteName: 'Avira',
    title: 'Avira — Move Free',
    description:
      'Premium sports gear and athletic apparel in Egypt. Free delivery, authentic products, easy returns.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Avira — Move Free' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Avira — Move Free',
    description:
      'Premium sports gear and athletic apparel in Egypt. Free delivery, authentic products, easy returns.',
    images: ['/og-image.png'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getLocale();
  const session = await auth();
  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={`${dmSans.variable} ${barlowCondensed.variable} ${cairo.variable}`}
    >
      <body className={`bg-bg-page ${locale === 'ar' ? 'font-arabic' : 'font-primary'}`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-btn focus:text-bg-dark focus:rounded-btn-sm focus:text-sm focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Providers locale={locale} session={session}>
          <Suspense fallback={null}>
            <ScrollToTop />
          </Suspense>
          <MobileMenu />
          <SearchOverlay />
          {children}
        </Providers>
      </body>
    </html>
  );
}

