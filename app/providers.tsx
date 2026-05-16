'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';
import { LocaleProvider } from '@/modules/_shared/i18n/i18n.context';
import type { Locale } from '@/modules/_shared/i18n/locale';
import type { Session } from 'next-auth';

interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
  session: Session | null;
}

export function Providers({ children, locale, session }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <LocaleProvider locale={locale}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
        <NextTopLoader color="#6DDE26" showSpinner={false} height={3} />
        <SessionProvider session={session} refetchOnWindowFocus={false} refetchInterval={5 * 60}>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </QueryClientProvider>
        </SessionProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
