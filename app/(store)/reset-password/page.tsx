'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { resetPassword } from '@/modules/auth/auth.password-reset.service';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLocale();

  const schema = z
    .object({
      password: z
        .string()
        .min(8, t.auth.resetPasswordPassMin)
        .regex(/[a-zA-Z]/, t.auth.resetPasswordPassLetter)
        .regex(/[0-9]/, t.auth.resetPasswordPassNumber),
      confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
      message: t.auth.resetPasswordPassMatch,
      path: ['confirmPassword'],
    });

  type FormInput = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormInput) => {
    if (!token) {
      toast.error(t.auth.resetPasswordMissingToken);
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(token, data.password);
    setIsLoading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(t.auth.resetPasswordSuccess);
    router.push('/login');
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-site py-12">
        <div className="w-full max-w-md">
          <div className="bg-bg-white rounded-card-lg shadow-newsletter px-8 py-10 text-center">
            <h1 className="text-section-heading font-semibold text-text-primary mb-2">
              {t.auth.resetPasswordInvalidLink}
            </h1>
            <p className="text-nav-sm text-text-secondary mb-6">
              {t.auth.resetPasswordInvalidLinkSub}
            </p>
            <Link href="/forgot-password" className="text-nav-sm text-primary font-semibold hover:underline">
              {t.auth.resetPasswordRequestNew}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-site py-12">
      <div className="w-full max-w-md">
        <div className="bg-bg-white rounded-card-lg shadow-newsletter px-8 py-10">
          <h1 className="text-section-heading font-semibold text-text-primary mb-2 text-center">
            {t.auth.resetPasswordHeading}
          </h1>
          <p className="text-nav-sm text-text-secondary text-center mb-8">
            {t.auth.resetPasswordSub}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-nav-sm font-medium text-text-primary mb-1.5" htmlFor="password">
                {t.auth.resetPasswordNewPassword}
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="field-input"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-xs text-sale mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-nav-sm font-medium text-text-primary mb-1.5" htmlFor="confirmPassword">
                {t.auth.resetPasswordConfirm}
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className="field-input"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-sale mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isLoading ? t.auth.resetPasswordUpdating : t.auth.resetPasswordButton}
            </button>
          </form>

          <p className="text-nav-sm text-text-secondary text-center mt-6">
            <Link href="/login" className="text-primary font-semibold hover:underline">
              {t.auth.forgotPasswordBackToLogin}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}