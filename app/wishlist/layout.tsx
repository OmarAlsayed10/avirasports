import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Wishlist',
  description: 'View and manage your wishlisted sports gear on Avira.',
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
