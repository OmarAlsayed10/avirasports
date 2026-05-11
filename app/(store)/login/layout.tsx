import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Avira account.',
};

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session) redirect('/account');
  return <>{children}</>;
}
