import { ProductCard } from '../product-card/product-card';
import { relatedProductsTokens } from './related-products.tokens';
import type { RelatedProductsProps } from './related-products.types';

export function RelatedProducts({ products, title = 'You May Also Like' }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section aria-label={title}>
      <h2 className={relatedProductsTokens.heading}>{title}</h2>
      <div className={relatedProductsTokens.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
