import type { ImageLoaderProps } from 'next/image';

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  // Local paths and inline data/blob previews pass through untouched.
  if (src.startsWith('/') || src.startsWith('data:') || src.startsWith('blob:')) return src;

  const params = `f_auto,c_limit,w_${width},q_${quality ?? 'auto'}`;

  // Full Cloudinary delivery URL (e.g. a stored secure_url): inject transforms right after
  // /image/upload/ so the avatar gets resized, while keeping the /v<version>/ segment for cache-busting.
  const marker = '/image/upload/';
  const i = src.indexOf(marker);
  if (src.startsWith('http') && src.includes('res.cloudinary.com') && i !== -1) {
    return `${src.slice(0, i + marker.length)}${params}/${src.slice(i + marker.length)}`;
  }

  // Other absolute URLs (e.g. Google avatars) pass through.
  if (src.startsWith('http')) return src;

  // Bare Cloudinary public ID.
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params}/${src}`;
}
