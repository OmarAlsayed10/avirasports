import { ProductCard, type ProductCardData } from './product-card';

interface RelatedProductsProps {
  products: ProductCardData[];
  title?: string;
}

export function RelatedProducts({ products, title = 'You May Also Like' }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section aria-label={title}>
      <h2 className="text-newsletter-sub font-semibold text-text-primary mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
