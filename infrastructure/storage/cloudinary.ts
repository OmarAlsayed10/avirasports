import { createHash } from 'crypto';

const cloudName = () => process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const apiKey = () => process.env.CLOUDINARY_API_KEY!;
const apiSecret = () => process.env.CLOUDINARY_API_SECRET!;

/** Raster image types we accept for upload. SVG is deliberately excluded (script payload / stored-XSS risk). */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;
export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

/** Build a Cloudinary delivery URL from a stored public ID. Passes through full URLs and blob/data previews. */
export function cloudinaryImageUrl(publicIdOrUrl: string, transform = 'w_200,h_200,c_fill'): string {
  if (!publicIdOrUrl) return '';
  if (publicIdOrUrl.startsWith('http') || publicIdOrUrl.startsWith('blob:') || publicIdOrUrl.startsWith('data:')) {
    return publicIdOrUrl;
  }
  return `https://res.cloudinary.com/${cloudName()}/image/upload/${transform}/${publicIdOrUrl}`;
}

/** Reject anything that isn't an allowed raster image within the size cap. Returns null when valid. */
export function validateImageUpload(file: File): { error: string; status: number } | null {
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return { error: 'Unsupported image type. Allowed: JPEG, PNG, WebP, AVIF.', status: 415 };
  }
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return { error: 'Image exceeds the 5MB size limit.', status: 413 };
  }
  return null;
}

/** Upload a validated image buffer to Cloudinary under a deterministic public ID. Throws on failure. */
export async function uploadImageToCloudinary(
  buffer: Buffer,
  contentType: string,
  publicId: string,
): Promise<{ publicId: string; secureUrl: string }> {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret()}`)
    .digest('hex');

  const form = new FormData();
  form.append('file', `data:${contentType};base64,${buffer.toString('base64')}`);
  form.append('public_id', publicId);
  form.append('api_key', apiKey());
  form.append('timestamp', String(timestamp));
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName()}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const data = (await res.json()) as { public_id?: string; secure_url?: string; error?: { message: string } };
  if (!data.public_id || !data.secure_url) {
    throw new Error(data.error?.message ?? 'Cloudinary upload failed');
  }
  return { publicId: data.public_id, secureUrl: data.secure_url };
}

export async function deleteCloudinaryAsset(urlOrPublicId: string): Promise<void> {
  const publicId = toPublicId(urlOrPublicId);
  if (!publicId) return;

  const timestamp = Math.round(Date.now() / 1000);
  const signature = createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret()}`)
    .digest('hex');

  const form = new FormData();
  form.append('public_id', publicId);
  form.append('api_key', apiKey());
  form.append('timestamp', String(timestamp));
  form.append('signature', signature);

  await fetch(`https://api.cloudinary.com/v1_1/${cloudName()}/image/destroy`, {
    method: 'POST',
    body: form,
  }).catch(() => null);
}

export async function deleteCloudinaryAssets(urlsOrPublicIds: string[]): Promise<void> {
  await Promise.all(urlsOrPublicIds.map((id) => deleteCloudinaryAsset(id)));
}

function toPublicId(urlOrPublicId: string): string | null {
  if (!urlOrPublicId) return null;
  if (!urlOrPublicId.startsWith('http')) return urlOrPublicId;
  const match = urlOrPublicId.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
  return match?.[1] ?? null;
}
