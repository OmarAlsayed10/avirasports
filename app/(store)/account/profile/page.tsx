'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProfile, updateProfileImage, deleteProfileImage } from '@/modules/account/account.service';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { Upload, Loader2, User, Trash2 } from 'lucide-react';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { createZodErrorMap } from '@/modules/_shared/i18n/i18n.zod-error-map';

const profileSchema = z.object({
  name: z.string().min(2).max(80).trim().optional().or(z.literal('')),
  email: z.string().email().toLowerCase().max(255).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  currentPassword: z.string().optional().or(z.literal('')),
  newPassword: z.string().min(8).regex(/[a-zA-Z]/).regex(/[0-9]/).optional().or(z.literal('')),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const { t } = useLocale();

  const resolver = useMemo(() => zodResolver(profileSchema, { errorMap: createZodErrorMap(t) }), [t]);
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileInput>({ resolver });

  useEffect(() => {
    fetch('/api/account/profile-meta')
      .then((r) => r.json())
      .then((d: { hasPassword?: boolean }) => setHasPassword(d.hasPassword ?? false))
      .catch(() => setHasPassword(false));
  }, []);

  const onSubmit = async (data: ProfileInput) => {
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '' && v !== undefined)
    );
    if (Object.keys(payload).length === 0) {
      toast.info(t.account.noChanges);
      return;
    }

    setIsLoading(true);
    const result = await updateProfile(payload);
    setIsLoading(false);

    if (result.ok) {
      toast.success(t.account.profileUpdated);
    } else {
      toast.error(result.error);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/account/upload', { method: 'POST', body: fd });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        const result = await updateProfileImage(data.url);
        if (result.ok) {
          await updateSession({ image: data.url });
          toast.success(t.account.profileUpdated);
        } else {
          toast.error(result.error);
        }
      } else {
        toast.error(data.error ?? 'Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    setUploading(true);
    try {
      const result = await deleteProfileImage();
      if (result.ok) {
        await updateSession({ image: null });
        toast.success(t.account.profileUpdated);
      } else {
        toast.error(result.error);
      }
    } finally {
      setUploading(false);
    }
  };

  const image = session?.user?.image;
  const name = session?.user?.name ?? '';

  return (
    <div className="max-w-lg mx-auto px-site py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/account" className="text-nav-sm text-text-secondary hover:text-primary">
          {t.dir === 'rtl' ? '→' : '←'} {t.account.title}
        </Link>
      </div>

      <h1 className="text-section-heading font-semibold text-text-primary dark:text-text-on-dark mb-8">{t.account.editProfile}</h1>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary-btn flex items-center justify-center overflow-hidden flex-shrink-0">
          {image ? (
            <Image src={image} alt={name} width={64} height={64} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-bg-dark" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className={`flex items-center gap-2 px-4 py-2 border border-border-primary/40 dark:border-white/30 rounded-btn-sm text-nav-sm font-semibold text-text-primary dark:text-text-on-dark hover:border-primary dark:hover:border-primary-btn transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? t.account.saving : t.account.uploadPhoto}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ''; }}
            />
          </label>
          {image && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={uploading}
              aria-label={t.account.removePhoto}
              className="flex items-center justify-center w-9 h-9 border border-border-primary/40 dark:border-white/30 rounded-btn-sm text-sale hover:border-sale hover:bg-sale/5 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-white dark:bg-bg-surface rounded-card-lg border border-border-primary/10 dark:border-white/10 p-6 space-y-5" noValidate>
        <div>
          <label className="block text-nav-sm font-medium text-text-primary dark:text-text-on-dark mb-1.5" htmlFor="name">{t.auth.fullName}</label>
          <input id="name" type="text" {...register('name')} className="field-input" placeholder={t.account.leaveBlankToKeep} />
          {errors.name && <p className="text-xs text-sale mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-nav-sm font-medium text-text-primary dark:text-text-on-dark mb-1.5" htmlFor="email">{t.auth.email}</label>
          <input id="email" type="email" {...register('email')} className="field-input" placeholder={t.account.leaveBlankToKeep} autoComplete="email" />
          {errors.email && <p className="text-xs text-sale mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-nav-sm font-medium text-text-primary dark:text-text-on-dark mb-1.5" htmlFor="phone">{t.auth.phone}</label>
          <input id="phone" type="tel" {...register('phone')} className="field-input" placeholder="01xxxxxxxxx" autoComplete="tel" />
          {errors.phone && <p className="text-xs text-sale mt-1">{errors.phone.message}</p>}
        </div>

        <hr className="border-border-primary/10 dark:border-white/10" />

        {hasPassword === false ? (
          <>
            <div>
              <p className="text-xs font-semibold text-text-secondary dark:text-text-footer-link uppercase tracking-wider">{t.account.setPassword}</p>
              <p className="text-xs text-text-secondary dark:text-text-footer-link mt-1">{t.account.setPasswordSub}</p>
            </div>
            <div>
              <label className="block text-nav-sm font-medium text-text-primary dark:text-text-on-dark mb-1.5" htmlFor="newPassword">{t.account.newPassword}</label>
              <input id="newPassword" type="password" {...register('newPassword')} className="field-input" placeholder={t.account.newPasswordPlaceholder} autoComplete="new-password" />
              {errors.newPassword && <p className="text-xs text-sale mt-1">{errors.newPassword.message}</p>}
            </div>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold text-text-secondary dark:text-text-footer-link uppercase tracking-wider">{t.account.changePassword}</p>
            <div>
              <label className="block text-nav-sm font-medium text-text-primary dark:text-text-on-dark mb-1.5" htmlFor="currentPassword">{t.account.currentPassword}</label>
              <input id="currentPassword" type="password" {...register('currentPassword')} className="field-input" placeholder={t.account.currentPasswordPlaceholder} autoComplete="current-password" />
              {errors.currentPassword && <p className="text-xs text-sale mt-1">{errors.currentPassword.message}</p>}
            </div>
            <div>
              <label className="block text-nav-sm font-medium text-text-primary dark:text-text-on-dark mb-1.5" htmlFor="newPassword">{t.account.newPassword}</label>
              <input id="newPassword" type="password" {...register('newPassword')} className="field-input" placeholder={t.account.newPasswordPlaceholder} autoComplete="new-password" />
              {errors.newPassword && <p className="text-xs text-sale mt-1">{errors.newPassword.message}</p>}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {isLoading ? t.account.saving : t.account.saveChanges}
        </button>
      </form>
    </div>
  );
}
