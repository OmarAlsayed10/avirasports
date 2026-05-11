import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create an Avira account for faster checkout and order tracking.',
};

export default async function RegisterLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session) redirect('/account');
  return <>{children}</>;
}
