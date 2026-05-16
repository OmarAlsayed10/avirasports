import { ProductCard, type ProductCardData } from './product-card';
import { productTokens } from '../product.tokens';

interface RelatedProductsProps {
  products: ProductCardData[];
  title?: string;
}

export function RelatedProducts({ products, title = 'You May Also Like' }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section aria-label={title}>
      <h2 className={productTokens.relatedProducts.heading}>{title}</h2>
      <div className={productTokens.relatedProducts.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
