'use server';

import { auth } from '@/infrastructure/auth/auth.config';
import { prisma } from '@/infrastructure/db/prisma';
import { addressSchema } from '@/modules/account/account.validators';
import { egyptianPhoneSchema } from '@/modules/_shared/validators/phone.validators';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { deleteCloudinaryAsset } from '@/infrastructure/storage/cloudinary';
import type { ActionResult } from '@/modules/_shared/types/action-result.type';

const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).trim().optional(),
  email: z.string().email().toLowerCase().max(255).optional(),
  phone: egyptianPhoneSchema.optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).regex(/[a-zA-Z]/).regex(/[0-9]/).optional(),
});

export async function updateProfileImage(imageUrl: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Not authenticated', code: 'UNAUTH' };

  // Accepts a full https URL (Google avatar) or a bare Cloudinary public ID (our uploads, e.g. "avira/profiles/<hash>").
  const ref = z
    .string()
    .min(1)
    .max(1000)
    .refine((v) => /^https:\/\//.test(v) || /^[\w-]+(\/[\w-]+)*$/.test(v), 'Invalid image reference')
    .safeParse(imageUrl);
  if (!ref.success) return { ok: false, error: 'Invalid image URL', code: 'VALIDATION' };

  await prisma.user.update({ where: { id: session.user.id }, data: { image: ref.data } });
  return { ok: true };
}

export async function deleteProfileImage(): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Not authenticated', code: 'UNAUTH' };

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { image: true } });
  // Only our own Cloudinary asset gets destroyed; deleteCloudinaryAsset no-ops on non-Cloudinary URLs (e.g. Google avatars).
  if (user?.image) await deleteCloudinaryAsset(user.image);

  await prisma.user.update({ where: { id: session.user.id }, data: { image: null } });
  return { ok: true };
}

export async function updateProfile(rawInput: unknown): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Not authenticated', code: 'UNAUTH' };

  const parsed = updateProfileSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; '), code: 'VALIDATION' };
  }

  const { name, email, phone, currentPassword, newPassword } = parsed.data;
  const userId = session.user.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, error: 'User not found', code: 'NOT_FOUND' };

  if (email && email !== user.email) {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return { ok: false, error: 'Email already in use', code: 'CONFLICT' };
  }

  let passwordHash: string | undefined;
  if (newPassword) {
    if (user.passwordHash) {
      if (!currentPassword) return { ok: false, error: 'Current password required to change password', code: 'VALIDATION' };
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) return { ok: false, error: 'Current password is incorrect', code: 'FORBIDDEN' };
    }
    passwordHash = await bcrypt.hash(newPassword, 12);
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(passwordHash && { passwordHash }),
    },
  });

  return { ok: true };
}

export async function createAddress(rawInput: unknown): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Not authenticated', code: 'UNAUTH' };

  const parsed = addressSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; '), code: 'VALIDATION' };
  }

  const { isDefault, ...rest } = parsed.data;

  const userId = session.user.id;

  const address = await prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    return tx.address.create({
      data: { ...rest, userId, isDefault: isDefault ?? false },
    });
  });

  return { ok: true, data: { id: address.id } };
}

export async function updateAddress(id: string, rawInput: unknown): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Not authenticated', code: 'UNAUTH' };

  const parsed = addressSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; '), code: 'VALIDATION' };
  }

  const address = await prisma.address.findUnique({ where: { id } });
  if (!address) return { ok: false, error: 'Address not found', code: 'NOT_FOUND' };
  if (address.userId !== session.user.id) return { ok: false, error: 'Forbidden', code: 'FORBIDDEN' };

  const { isDefault, ...rest } = parsed.data;

  const userId = session.user.id;

  await prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    await tx.address.update({
      where: { id },
      data: { ...rest, ...(isDefault !== undefined && { isDefault }) },
    });
  });

  return { ok: true };
}

export async function deleteAddress(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Not authenticated', code: 'UNAUTH' };

  const address = await prisma.address.findUnique({ where: { id } });
  if (!address) return { ok: false, error: 'Address not found', code: 'NOT_FOUND' };
  if (address.userId !== session.user.id) return { ok: false, error: 'Forbidden', code: 'FORBIDDEN' };

  await prisma.address.delete({ where: { id } });
  return { ok: true };
}

export async function setDefaultAddress(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Not authenticated', code: 'UNAUTH' };

  const address = await prisma.address.findUnique({ where: { id } });
  if (!address) return { ok: false, error: 'Address not found', code: 'NOT_FOUND' };
  if (address.userId !== session.user.id) return { ok: false, error: 'Forbidden', code: 'FORBIDDEN' };

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    }),
    prisma.address.update({
      where: { id },
      data: { isDefault: true },
    }),
  ]);

  return { ok: true };
}
