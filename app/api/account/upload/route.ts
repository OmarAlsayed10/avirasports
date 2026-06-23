import { auth } from '@/infrastructure/auth/auth.config';
import { NextResponse } from 'next/server';
import { validateImageUpload, uploadImageToCloudinary } from '@/infrastructure/storage/cloudinary';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const invalid = validateImageUpload(file);
  if (invalid) return NextResponse.json({ error: invalid.error }, { status: invalid.status });

  const buffer = Buffer.from(await file.arrayBuffer());
  // One asset per user: re-uploading overwrites it (no orphans to clean up). The returned
  // secure_url carries a /v<version>/ segment that changes on overwrite, so the CDN cache busts.
  const publicId = `avira/profiles/${session.user.id}`;

  try {
    const { secureUrl } = await uploadImageToCloudinary(buffer, file.type, publicId);
    return NextResponse.json({ url: secureUrl });
  } catch (err) {
    console.error('[Upload] Cloudinary upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 502 });
  }
}
