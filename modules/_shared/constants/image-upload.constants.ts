export const MAX_IMAGE_UPLOAD_MB = 5;
export const MAX_IMAGE_UPLOAD_BYTES = MAX_IMAGE_UPLOAD_MB * 1024 * 1024;
// SVG is deliberately excluded (script payload / stored-XSS risk).
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;

export function imageUploadError(file: File): 'type' | 'size' | null {
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) return 'type';
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) return 'size';
  return null;
}
