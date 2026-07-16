'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import { createCategory, updateCategory, deleteCategory } from '@/modules/admin/categories/categories.service';
import { Pencil, Trash2, Plus, X, Check, Loader2, Upload, ImageIcon, MoreHorizontal } from 'lucide-react';
import { RowActions } from '@/modules/admin/_shared/components/row-actions';
import { slugify } from '@/modules/_shared/utils/slugify';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { toCloudinaryUrl } from '@/modules/_shared/utils/cloudinary-url';

type Category = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  sortOrder: number;
  hasMultipleSizes: boolean;
  _count: { products: number };
};


function ImageUploadField({ initialUrl }: { initialUrl?: string | null }) {
  const [url, setUrl] = useState(initialUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const { t } = useLocale();

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload?folder=categories', { method: 'POST', body: fd });
      const data = await res.json() as { url?: string; secureUrl?: string; error?: string };
      if (data.secureUrl) setUrl(data.secureUrl);
      else alert(data.error ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{t.admin.categoryImage}</label>
      <div className="flex items-center gap-3">
        <div className="w-24 h-16 rounded border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
          {url ? (
            <img src={toCloudinaryUrl(url, 'w_120,h_80,c_fill')} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-300" />
          )}
        </div>
        <label className={`flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? t.admin.uploading : t.admin.upload}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }}
          />
        </label>
        {url && (
          <button type="button" onClick={() => setUrl('')} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
            {t.admin.remove}
          </button>
        )}
      </div>
      <input type="hidden" name="iconUrl" value={url || ''} />
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors';
const errorCls = 'text-xs text-red-500 mt-1';

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 px-4 py-2 bg-primary-btn text-white text-sm font-medium rounded-md hover:bg-primary-btn/90 disabled:opacity-60 transition-colors"
    >
      {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
      {pending ? pendingLabel : label}
    </button>
  );
}

type CategoryFormState = { success?: boolean; error?: { name?: string[]; slug?: string[] } } | null;

function CategoryForm({
  action,
  state,
  category,
  onDone,
}: {
  action: (payload: FormData) => void;
  state: CategoryFormState;
  category?: Category;
  onDone: () => void;
}) {
  const { t } = useLocale();
  const isEdit = !!category;

  useEffect(() => {
    if (state?.success) onDone();
  }, [state, onDone]);

  return (
    <form
      action={action}
      className={`border rounded-lg p-4 space-y-3 ${isEdit ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
    >
      {isEdit && <input type="hidden" name="id" value={category.id} />}
      {!isEdit && <p className="text-sm font-semibold text-gray-700">{t.admin.newCategory}</p>}
      {state?.error?.name && <p className={errorCls}>{state.error.name[0]}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t.admin.nameLabel}</label>
          <input
            name="name"
            required
            defaultValue={category?.name}
            className={inputCls}
            placeholder="e.g. Running"
            onChange={!isEdit ? (e) => {
              const slugInput = e.currentTarget.form?.querySelector<HTMLInputElement>('[name="slug"]');
              if (slugInput && !slugInput.dataset.edited) slugInput.value = slugify(e.target.value);
            } : undefined}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t.admin.nameArLabel}</label>
          <input name="nameAr" defaultValue={category?.nameAr ?? ''} className={inputCls} dir="rtl" placeholder="مثلاً: الجري" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t.admin.slugLabel}</label>
          <input
            name="slug"
            required
            defaultValue={category?.slug}
            className={inputCls}
            placeholder="e.g. running"
            onInput={!isEdit ? (e) => { e.currentTarget.dataset.edited = 'true'; } : undefined}
          />
          {state?.error?.slug && <p className={errorCls}>{state.error.slug[0]}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t.admin.descriptionLabel}</label>
          <input name="description" defaultValue={category?.description ?? ''} className={inputCls} placeholder="Optional" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t.admin.sortOrderLabel}</label>
          <input name="sortOrder" type="number" min="0" defaultValue={category?.sortOrder ?? 0} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t.admin.categorySizeBehavior}</label>
          <select
            name="hasMultipleSizes"
            defaultValue={category?.hasMultipleSizes === false ? 'false' : 'true'}
            className={inputCls}
          >
            <option value="true">{t.admin.multipleSizes}</option>
            <option value="false">{t.admin.oneSize}</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">{t.admin.categorySizeBehaviorHint}</p>
        </div>
      </div>

      <ImageUploadField initialUrl={category?.iconUrl} />

      <div className="flex gap-2 pt-1">
        <SubmitButton
          label={isEdit ? t.admin.update : t.admin.save}
          pendingLabel={t.admin.saving}
        />
        <button
          type="button"
          onClick={onDone}
          className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          {t.admin.cancel}
        </button>
      </div>
    </form>
  );
}

function AddCategoryForm({ onDone }: { onDone: () => void }) {
  const [state, action] = useFormState(createCategory, null);
  return <CategoryForm action={action} state={state} onDone={onDone} />;
}

function EditCategoryForm({ category, onDone }: { category: Category; onDone: () => void }) {
  const [state, action] = useFormState(updateCategory, null);
  return <CategoryForm action={action} state={state} category={category} onDone={onDone} />;
}

function DeleteButton({ id, productCount }: { id: string; productCount: number }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const { t } = useLocale();

  const handleDelete = async () => {
    if (!confirm(t.admin.deleteCategoryConfirm)) return;
    setPending(true);
    const result = await deleteCategory(id);
    setPending(false);
    if (result?.error) setError(result.error);
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={pending || productCount > 0}
        title={productCount > 0 ? t.admin.hasProductsTooltip(productCount) : t.admin.delete}
        className="p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function CategoryList({ categories }: { categories: Category[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { t } = useLocale();

  async function handleDeleteCategory(id: string) {
    if (!confirm(t.admin.deleteCategoryConfirm)) return;
    setPendingDeleteId(id);
    await deleteCategory(id);
    setPendingDeleteId(null);
  }

  return (
    <div className="space-y-4">
      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-btn text-white text-sm font-medium rounded-md hover:bg-primary-btn/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t.admin.addCategory}
        </button>
      )}

      {showAdd && <AddCategoryForm onDone={() => setShowAdd(false)} />}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {categories.length === 0 ? (
          <p className="p-6 text-sm text-gray-400 italic text-center">{t.admin.noCategoriesYet}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">{t.admin.nameLabel.replace(' *', '')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">{t.admin.slug}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">{t.admin.description}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">{t.admin.sizesLabel}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">{t.admin.image}</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">{t.admin.productsCol}</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">{t.admin.order}</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <>
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{cat.name}</p>
                      {cat.nameAr && <p className="text-xs text-gray-400 mt-0.5" dir="rtl">{cat.nameAr}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-xs truncate">
                      {cat.description || <span className="italic text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell whitespace-nowrap">
                      {cat.hasMultipleSizes ? t.admin.multipleSizes : t.admin.oneSize}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {cat.iconUrl ? (
                        <img src={toCloudinaryUrl(cat.iconUrl, 'w_120,h_80,c_fill')} alt="" className="w-16 h-10 rounded object-cover border border-gray-100" />
                      ) : (
                        <span className="italic text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{cat._count.products}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{cat.sortOrder}</td>
                    <td className="px-4 py-3">
                      <RowActions
                        actions={[
                          {
                            label: editingId === cat.id ? t.admin.cancel : t.admin.edit,
                            onClick: () => setEditingId(editingId === cat.id ? null : cat.id),
                          },
                          {
                            label: pendingDeleteId === cat.id ? 'Deleting…' : t.admin.delete,
                            variant: 'danger',
                            disabled: cat._count.products > 0 || pendingDeleteId === cat.id,
                            onClick: () => handleDeleteCategory(cat.id),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                  {editingId === cat.id && (
                    <tr key={`edit-${cat.id}`}>
                      <td colSpan={8} className="px-4 py-3">
                        <EditCategoryForm category={cat} onDone={() => setEditingId(null)} />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
