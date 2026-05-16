import { createHash } from 'crypto';

const cloudName = () => process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const apiKey = () => process.env.CLOUDINARY_API_KEY!;
const apiSecret = () => process.env.CLOUDINARY_API_SECRET!;

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
