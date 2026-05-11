'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { registerSchema, type RegisterInput } from '@/lib/validators/auth';
import { registerUser } from '@/lib/server-actions/auth';
import { GoogleIcon } from '@/components/shared/google-icon';
import { toast } from 'sonner';
import { useLocale } from '@/lib/i18n/context';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    const result = await registerUser(data);
    setIsLoading(false);

    if (!result.ok) {
      if (result.code === 'CONFLICT') {
        toast.error(t.auth.emailExists);
      } else {
        toast.error(result.error);
      }
      return;
    }

    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    router.push('/account');
    router.refresh();
  };

  const handleGoogle = () => signIn('google', { callbackUrl: '/account' });

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-site py-12">
      <div className="w-full max-w-md">
        <div className="bg-bg-white dark:bg-bg-surface rounded-card-lg shadow-newsletter px-8 py-10">
          <h1 className="text-section-heading font-semibold text-text-primary dark:text-text-on-dark mb-2 text-center">
            {t.auth.createAccount}
          </h1>
          <p className="text-nav-sm text-text-secondary dark:text-text-footer-link text-center mb-8">
            {t.auth.createAccountSub}
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 h-12 border border-border-primary/40 dark:border-white/20 rounded-btn-sm text-nav-sm font-semibold text-text-primary dark:text-text-on-dark hover:bg-bg-page dark:hover:bg-bg-dark transition-colors mb-6"
          >
            <GoogleIcon />
            {t.auth.continueWithGoogle}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border-primary/20 dark:bg-white/10" />
            <span className="text-xs text-text-secondary dark:text-text-footer-link">{t.auth.or}</span>
            <div className="flex-1 h-px bg-border-primary/20 dark:bg-white/10" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-nav-sm font-medium text-text-primary dark:text-text-on-dark mb-1.5" htmlFor="name">
                {t.auth.fullName}
              </label>
              <input id="name" type="text" {...register('name')} className="field-input" placeholder={t.auth.fullNamePlaceholder} autoComplete="name" />
              {errors.name && <p className="text-xs text-sale mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-nav-sm font-medium text-text-primary dark:text-text-on-dark mb-1.5" htmlFor="email">
                {t.auth.email}
              </label>
              <input id="email" type="email" {...register('email')} className="field-input" placeholder={t.auth.emailPlaceholder} autoComplete="email" />
              {errors.email && <p className="text-xs text-sale mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-nav-sm font-medium text-text-primary dark:text-text-on-dark mb-1.5" htmlFor="phone">
                {t.auth.phone}
              </label>
              <input id="phone" type="tel" {...register('phone')} className="field-input" placeholder={t.auth.phonePlaceholder} autoComplete="tel" />
              {errors.phone && <p className="text-xs text-sale mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-nav-sm font-medium text-text-primary dark:text-text-on-dark mb-1.5" htmlFor="password">
                {t.auth.password}
              </label>
              <input id="password" type="password" {...register('password')} className="field-input" placeholder={t.auth.passwordPlaceholder} autoComplete="new-password" />
              {errors.password && <p className="text-xs text-sale mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-nav-sm font-medium text-text-primary dark:text-text-on-dark mb-1.5" htmlFor="confirmPassword">
                {t.auth.confirmPassword}
              </label>
              <input id="confirmPassword" type="password" {...register('confirmPassword')} className="field-input" placeholder={t.auth.passwordPlaceholder} autoComplete="new-password" />
              {errors.confirmPassword && <p className="text-xs text-sale mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isLoading ? t.auth.creatingAccount : t.auth.createAccountButton}
            </button>
          </form>

          <p className="text-nav-sm text-text-secondary dark:text-text-footer-link text-center mt-6">
            {t.auth.haveAccount}{' '}
            <Link href="/login" className="text-primary dark:text-primary-btn font-semibold hover:underline">
              {t.auth.signInLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
