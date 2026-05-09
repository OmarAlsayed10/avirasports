import { Suspense } from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { CategoryCards } from '@/components/home/category-cards';
import { TrustSection } from '@/components/home/trust-section';
import { NewsletterSignup } from '@/components/home/newsletter-signup';
import { HomepageProductSection } from '@/components/home/homepage-product-section';
import { ProductGridSkeleton } from '@/components/product/product-grid';
import { getVisibleHomepageSections } from '@/lib/queries/homepage';

export const revalidate = 3600;

export const metadata = {
  title: 'Avira — Move Free',
  description:
    'Shop premium sports gear and athletic apparel in Egypt — running, training, cycling, swimming, yoga, and football. Free delivery, authentic products, easy returns.',
};

export default async function HomePage() {
  const sections = await getVisibleHomepageSections();

  return (
    <>
      <HeroSection />
      <TrustSection />
      <CategoryCards />
      {sections.map((section) => (
        <Suspense key={section.id} fallback={<ProductGridSkeleton count={section.productLimit} />}>
          <HomepageProductSection section={section} />
        </Suspense>
      ))}
      <NewsletterSignup />
    </>
  );
}
