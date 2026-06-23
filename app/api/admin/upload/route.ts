import { auth } from '@/infrastructure/auth/auth.config';
import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { validateImageUpload, uploadImageToCloudinary } from '@/infrastructure/storage/cloudinary';

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const folder = searchParams.get('folder') === 'categories' ? 'avira/categories' : 'avira/products';

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const invalid = validateImageUpload(file);
  if (invalid) return NextResponse.json({ error: invalid.error }, { status: invalid.status });

  const buffer = Buffer.from(await file.arrayBuffer());
  const publicId = `${folder}/${createHash('sha256').update(buffer).digest('hex')}`;

  try {
    const { publicId: id, secureUrl } = await uploadImageToCloudinary(buffer, file.type, publicId);
    return NextResponse.json({ url: id, secureUrl });
  } catch (err) {
    console.error('[Upload] Cloudinary upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 502 });
  }
}
