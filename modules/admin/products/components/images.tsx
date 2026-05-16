'use client';

import { useFieldArray } from 'react-hook-form';
import { Trash2, Upload, ImageIcon } from 'lucide-react';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { useProductForm } from './product-form-provider';
import { SectionShell } from './sectionSheel';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function previewUrl(url: string) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_200,c_fill/${url}`;
}



export function ImagesSection() {
  const { form, pendingFiles, setPendingFiles } = useProductForm();
  const { control, setValue, watch } = form;
  const { t } = useLocale();

  const { fields, append, remove } = useFieldArray({ control, name: 'images' });

  const handleFileUpload = (file: File) => {
    const tempId = `pending:${crypto.randomUUID()}`;
    const preview = URL.createObjectURL(file);
    setPendingFiles((prev) => new Map(prev).set(tempId, { file, preview }));
    append({ url: tempId, alt: '', isPrimary: fields.length === 0, sortOrder: fields.length });
  };

  const handleRemove = (i: number, url: string) => {
    if (url.startsWith('pending:')) {
      setPendingFiles((prev) => {
        const next = new Map(prev);
        const p:any = next.get(url);
        if (p) URL.revokeObjectURL(p.preview);
        next.delete(url);
        return next;
      });
    }
    remove(i);
  };

  const handleSetPrimary = (primaryIdx: number) => {
    fields.forEach((_, idx) => setValue(`images.${idx}.isPrimary`, idx === primaryIdx));
  };

  return (
    <SectionShell title={t.admin.images}>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {fields.map((field, i) => {
          const displayUrl = field.url.startsWith('pending:')
            ? (pendingFiles.get(field.url)?.preview ?? '')
            : previewUrl(field.url);

          return (
            <div
              key={field.id}
              className="relative group border border-gray-200 rounded-lg overflow-hidden aspect-square bg-gray-50"
            >
              {displayUrl ? (
                <img src={displayUrl} alt={field.alt || 'Image'} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleRemove(i, field.url)}
                  className="p-1.5 bg-white rounded text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {!watch(`images.${i}.isPrimary`) && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(i)}
                    className="text-xs bg-white rounded px-1.5 py-0.5 text-gray-700 hover:bg-gray-50"
                  >
                    {t.admin.setPrimary}
                  </button>
                )}
              </div>

              {watch(`images.${i}.isPrimary`) && (
                <span className="absolute top-1 left-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded font-medium">
                  {t.admin.primary}
                </span>
              )}
            </div>
          );
        })}

        <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
          <Upload className="w-5 h-5 text-gray-400 mb-1" />
          <span className="text-xs text-gray-400">{t.admin.upload}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
              e.target.value = '';
            }}
          />
        </label>
      </div>
    </SectionShell>
  );
}
