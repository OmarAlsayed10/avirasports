'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { requestPasswordReset } from '@/lib/server-actions/password-reset';
import { useLocale } from '@/lib/i18n/context';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLocale();

  const schema = z.object({
    email: z.string().email(t.auth.forgotPasswordEmailError),
  });
  type FormInput = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormInput) => {
    setIsLoading(true);
    const result = await requestPasswordReset(data.email);
    setIsLoading(false);

    if (!result.ok && result.code === 'RATE_LIMITED') {
      toast.error(result.error);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-site py-12">
      <div className="w-full max-w-md">
        <div className="bg-bg-white rounded-card-lg shadow-newsletter px-8 py-10">
          {submitted ? (
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-success/15 flex items-center justify-center">
                <svg className="w-7 h-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-section-heading font-semibold text-text-primary mb-2">
                {t.auth.forgotPasswordSuccess}
              </h1>
              <p className="text-nav-sm text-text-secondary mb-6">
                {t.auth.forgotPasswordSuccessSub}
              </p>
              <Link href="/login" className="text-nav-sm text-primary font-semibold hover:underline">
                {t.auth.forgotPasswordBackToLogin}
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-section-heading font-semibold text-text-primary mb-2 text-center">
                {t.auth.forgotPasswordHeading}
              </h1>
              <p className="text-nav-sm text-text-secondary text-center mb-8">
                {t.auth.forgotPasswordSub}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                  <label className="block text-nav-sm font-medium text-text-primary mb-1.5" htmlFor="email">
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {isLoading ? t.auth.forgotPasswordSending : t.auth.forgotPasswordButton}
                </button>
              </form>

              <p className="text-nav-sm text-text-secondary text-center mt-6">
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  {t.auth.forgotPasswordBackToLogin}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}