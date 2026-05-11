'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { loginSchema, type LoginInput } from '@/lib/validators/auth';
import { GoogleIcon } from '@/components/shared/google-icon';
import { toast } from 'sonner';
import { useLocale } from '@/lib/i18n/context';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const raw = searchParams.get('callbackUrl') ?? '';
  const callbackUrl =
    raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/\\')
      ? raw
      : '/auth/redirect';
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setIsLoading(false);

    if (result?.error) {
      toast.error(t.auth.wrongCredentials);
      return;
    }

    window.location.href = callbackUrl;
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-site py-12">
      <div className="w-full max-w-md">
        <div className="bg-bg-white dark:bg-bg-surface rounded-card-lg shadow-newsletter px-8 py-10">
          <h1 className="text-section-heading font-semibold text-text-primary dark:text-text-on-dark mb-2 text-center">
            {t.auth.signIn}
          </h1>
          <p className="text-nav-sm text-text-secondary dark:text-text-footer-link text-center mb-8">
            {t.auth.signInWelcome}
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 h-12 border border-border-primary/40 dark:border-white/20 rounded-btn-sm text-nav-sm font-semibold text-text-primary dark:text-text-on-dark hover:bg-bg-page dark:hover:bg-bg-dark transition-colors disabled:opacity-60 mb-6"
          >
            <GoogleIcon />
            {isGoogleLoading ? t.auth.redirecting : t.auth.continueWithGoogle}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border-primary/20 dark:bg-white/10" />
            <span className="text-xs text-text-secondary dark:text-text-footer-link">{t.auth.or}</span>
            <div className="flex-1 h-px bg-border-primary/20 dark:bg-white/10" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-nav-sm font-medium text-text-primary dark:text-text-on-dark mb-1.5" htmlFor="email">
                {t.auth.email}
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="field-input"
                placeholder={t.auth.emailPlaceholder}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-sale mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-nav-sm font-medium text-text-primary dark:text-text-on-dark" htmlFor="password">
                  {t.auth.password}
                </label>
                <Link href="/forgot-password" className="text-xs text-primary dark:text-primary-btn hover:underline">
                  {t.auth.forgotPassword}
                </Link>
              </div>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="field-input"
                placeholder={t.auth.passwordPlaceholder}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-xs text-sale mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isLoading ? t.auth.signingIn : t.auth.signInButton}
            </button>
          </form>

          <p className="text-nav-sm text-text-secondary dark:text-text-footer-link text-center mt-6">
            {t.auth.noAccount}{' '}
            <Link href="/register" className="text-primary dark:text-primary-btn font-semibold hover:underline">
              {t.auth.createOne}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
