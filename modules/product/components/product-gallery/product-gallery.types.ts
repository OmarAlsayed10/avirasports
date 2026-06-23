export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  overrideImageUrl?: string | null;
}
