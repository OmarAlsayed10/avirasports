'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { type AdminProductInput } from '@/modules/product/product.validators';
import { createProduct, updateProduct } from '@/modules/product/product.service';
import { useProductForm } from './product-form-provider';

export function useProductSubmit() {
  const { form, isEdit, productId, pendingFiles } = useProductForm();
  const [isPending, startTransition] = useTransition();

  const onSubmit = form.handleSubmit((data: AdminProductInput) => {
    startTransition(async () => {
      let finalImages = data.images;
      const toUpload = finalImages.filter((img) => img.url.startsWith('pending:'));

      if (toUpload.length > 0) {
        const results = await Promise.all(
          toUpload.map(async (img) => {
            const pending = pendingFiles.get(img.url);
            if (!pending) return null;

            const fd = new FormData();
            fd.append('file', pending.file);

            const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
            const json = await res.json() as { url?: string; error?: string };

            if (!json.url) {
              toast.error(json.error ?? 'Image upload failed');
              return null;
            }

            return { tempId: img.url, realUrl: json.url };
          })
        );

        if (results.some((r) => r === null)) return;

        const urlMap = new Map(results.map((r) => [r!.tempId, r!.realUrl]));
        finalImages = finalImages.map((img) => ({
          ...img,
          url: urlMap.get(img.url) ?? img.url,
        }));
      }

      const finalData = { ...data, images: finalImages };
      const result = isEdit
        ? await updateProduct(productId!, finalData)
        : await createProduct(finalData);

      if (result?.error) {
        for (const [field, messages] of Object.entries(result.error)) {
          form.setError(field as keyof AdminProductInput, {
            message: (messages as string[])[0],
          });
        }
      }
    });
  });

  return { onSubmit, isPending };
}
