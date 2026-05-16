import type { ImageLoaderProps } from 'next/image';

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith('/')) return src;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality ?? 'auto'}`];
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(',')}/${src}`;
}
