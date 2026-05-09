'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { createBrand, deleteBrand } from '@/lib/server-actions/admin/brands';
import { Plus, Trash2, Loader2, Check } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';

type Brand = { id: string; name: string; slug: string };

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 px-4 py-2 bg-primary-btn text-white text-sm font-medium rounded-md hover:bg-primary-btn/90 disabled:opacity-60 transition-colors shrink-0"
    >
      {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}

function DeleteButton({ id, title }: { id: string; title: string }) {
  const [pending, setPending] = useState(false);

  return (
    <button
      onClick={async () => { setPending(true); await deleteBrand(id); setPending(false); }}
      disabled={pending}
      title={title}
      className="p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-40 transition-colors"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}

export default function BrandList({ brands }: { brands: Brand[] }) {
  const [state, action] = useFormState(createBrand, null);
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      {/* Add form */}
      <form action={action} className="flex gap-2">
        <div className="flex-1">
          <input name="name" required className={inputCls} placeholder="e.g. Nike" />
          {state?.error?.name && (
            <p className="text-xs text-red-500 mt-1">{state.error.name[0]}</p>
          )}
        </div>
        <SubmitButton label={t.admin.add} />
      </form>

      {/* List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {brands.length === 0 ? (
          <p className="p-6 text-sm text-gray-400 italic text-center">{t.admin.noBrandsYet}</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {brands.map((brand) => (
              <li key={brand.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{brand.name}</p>
                  <p className="text-xs font-mono text-gray-400">{brand.slug}</p>
                </div>
                <DeleteButton id={brand.id} title={t.admin.deleteBrand} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
