import { Suspense } from 'react';
import { HeroSection } from '@/modules/home/components/hero-section';
import { CategoryCards } from '@/modules/home/components/category-cards';
import { TrustSection } from '@/modules/home/components/trust-section';
import { NewsletterSignup } from '@/modules/home/components/newsletter-signup';
import { HomepageProductSection } from '@/modules/home/components/homepage-product-section';
import { ProductGridSkeleton } from '@/modules/product/components/product-grid';
import { getVisibleHomepageSections } from '@/modules/home/home.queries';
import { FeedbackSection } from '@/modules/feedback/components/feedback-section';

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
      <FeedbackSection />
      <NewsletterSignup />
    </>
  );
}
