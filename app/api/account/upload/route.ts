import { auth } from '@/infrastructure/auth/auth.config';
import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const hash = createHash('sha256').update(buffer).digest('hex');
  const publicId = `avira/profiles/${hash}`;
  const base64DataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

  let cloudName: string, apiKey: string, apiSecret: string;
  try {
    cloudName = requireEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
    apiKey = requireEnv('CLOUDINARY_API_KEY');
    apiSecret = requireEnv('CLOUDINARY_API_SECRET');
  } catch (err) {
    console.error('[Upload] Missing env var:', err);
    return NextResponse.json({ error: 'Upload service not configured' }, { status: 500 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  const uploadForm = new FormData();
  uploadForm.append('file', base64DataUri);
  uploadForm.append('public_id', publicId);
  uploadForm.append('api_key', apiKey);
  uploadForm.append('timestamp', String(timestamp));
  uploadForm.append('signature', signature);

  let data: { public_id?: string; secure_url?: string; error?: { message: string } };
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: uploadForm }
    );
    data = await response.json() as typeof data;
  } catch (err) {
    console.error('[Upload] Cloudinary fetch failed:', err);
    return NextResponse.json({ error: 'Upload service unavailable' }, { status: 502 });
  }

  if (!data.public_id) {
    return NextResponse.json(
      { error: data.error?.message ?? 'Upload failed' },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: data.public_id, secureUrl: data.secure_url });
}
