'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminProductSchema, type AdminProductInput } from '@/lib/validators/admin-product';
import { createProduct, updateProduct } from '@/lib/server-actions/admin/products';
import { useState, useTransition, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { slugify } from '@/lib/utils/slugify';
import { Trash2, Plus, Loader2, Upload, ImageIcon, RefreshCw } from 'lucide-react';
import type { Category } from '@prisma/client';
import { useLocale } from '@/lib/i18n/context';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function previewUrl(url: string) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_200,c_fill/${url}`;
}

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const errorCls = 'text-xs text-red-500 mt-1';

type AttrType = 'text' | 'color';
type AttrGroup = { id: string; name: string; nameAr: string; type: AttrType; values: string[] };
type AttrSet = { id: string; groups: AttrGroup[] };

function uid() {
  return Math.random().toString(36).slice(2);
}

function cartesianProduct(arrays: string[][]): string[][] {
  return arrays.reduce<string[][]>(
    (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
    [[]]
  );
}

function isHex(v: string) {
  return /^#[0-9a-fA-F]{6}$/.test(v);
}

function AttrGroupRow({
  group,
  onChange,
  onRemove,
  attrNamePlaceholder,
  attrNameArPlaceholder,
  addValuePlaceholder,
  addLabel,
  addColorLabel,
}: {
  group: AttrGroup;
  onChange: (g: AttrGroup) => void;
  onRemove: () => void;
  attrNamePlaceholder: string;
  attrNameArPlaceholder: string;
  addValuePlaceholder: string;
  addLabel: string;
  addColorLabel: string;
}) {
  const [textInput, setTextInput] = useState('');

  const addTextValue = () => {
    const val = textInput.trim();
    if (!val || group.values.includes(val)) return;
    onChange({ ...group, values: [...group.values, val] });
    setTextInput('');
  };

  const addColorValue = () => {
    onChange({ ...group, values: [...group.values, '#000000'] });
  };

  const removeValue = (i: number) => {
    onChange({ ...group, values: group.values.filter((_, idx) => idx !== i) });
  };

  const updateColor = (i: number, hex: string) => {
    const next = [...group.values];
    next[i] = hex;
    onChange({ ...group, values: next });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex gap-2">
          <input
            value={group.name}
            onChange={(e) => onChange({ ...group, name: e.target.value })}
            placeholder={attrNamePlaceholder}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            value={group.nameAr}
            onChange={(e) => onChange({ ...group, nameAr: e.target.value })}
            placeholder={attrNameArPlaceholder}
            dir="rtl"
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        {/* Type toggle */}
        <div className="flex rounded-md overflow-hidden border border-gray-300 text-xs font-medium shrink-0">
          <button
            type="button"
            onClick={() => onChange({ ...group, type: 'text', values: [] })}
            className={`px-3 py-1.5 transition-colors ${group.type === 'text' ? 'bg-primary-btn text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Text
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...group, type: 'color', values: [] })}
            className={`px-3 py-1.5 transition-colors ${group.type === 'color' ? 'bg-primary-btn text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Color
          </button>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Values */}
      {group.type === 'text' ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {group.values.map((v, i) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
              >
                {v}
                <button
                  type="button"
                  onClick={() => removeValue(i)}
                  className="text-gray-400 hover:text-red-500 leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTextValue(); } }}
              placeholder={addValuePlaceholder}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="button"
              onClick={addTextValue}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
            >
              {addLabel}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-3">
            {group.values.map((hex, i) => (
              <div key={hex} className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => updateColor(i, e.target.value)}
                  className="w-8 h-8 p-0.5 border border-gray-300 rounded cursor-pointer bg-white"
                />
                <span className="text-xs font-mono text-gray-500">{hex}</span>
                <button
                  type="button"
                  onClick={() => removeValue(i)}
                  className="text-gray-400 hover:text-red-500 text-xs leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addColorValue}
            className="flex items-center gap-1 text-xs text-primary-btn font-medium hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> {addColorLabel}
          </button>
        </div>
      )}
    </div>
  );
}

interface ProductFormProps {
  categories: Category[];
  brands: { id: string; name: string; slug: string }[];
  defaultValues?: Partial<AdminProductInput>;
  productId?: string;
}

export default function ProductForm({ categories, brands, defaultValues, productId }: ProductFormProps) {
  const isEdit = !!productId;
  const [isPending, startTransition] = useTransition();
  const [pendingFiles, setPendingFiles] = useState<Map<string, { file: File; preview: string }>>(() => new Map());
  const pendingFilesRef = useRef(pendingFiles);
  pendingFilesRef.current = pendingFiles;
  const [attrSets, setAttrSets] = useState<AttrSet[]>([]);
  const { t } = useLocale();

  useEffect(() => {
    return () => { pendingFilesRef.current.forEach(({ preview }) => URL.revokeObjectURL(preview)); };
  }, []);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<AdminProductInput>({
    resolver: zodResolver(adminProductSchema),
    defaultValues: {
      name: '',
      nameAr: '',
      brand: '',
      gender: 'ALL' as const,
      modelNumber: '',
      slug: '',
      description: '',
      descriptionAr: '',
      specs: [],
      categoryId: '',
      basePriceEgp: 0,
      discountPercent: null,
      isActive: true,
      isFeatured: false,
      isHolidayOffer: false,
      images: [],
      variants: [],
      ...defaultValues,
    },
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } =
    useFieldArray({ control, name: 'specs' });

  const { fields: imageFields, append: appendImage, remove: removeImage } =
    useFieldArray({ control, name: 'images' });

  const { fields: variantFields, append: appendVariant, remove: removeVariant, replace: replaceVariants } =
    useFieldArray({ control, name: 'variants' });

  const onSubmit = (data: AdminProductInput) => {
    startTransition(async () => {
      let finalImages = data.images;
      const toUpload = finalImages.filter((img) => img.url.startsWith('pending:'));

      if (toUpload.length > 0) {
        const results = await Promise.all(
          toUpload.map(async (img) => {
            const p = pendingFiles.get(img.url);
            if (!p) return null;
            const fd = new FormData();
            fd.append('file', p.file);
            const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
            const json = await res.json() as { url?: string; error?: string };
            if (!json.url) {
              toast.error(json.error ?? 'Image upload failed');
              return null;
            }
            return { tempId: img.url, realUrl: json.url as string };
          })
        );

        if (results.some((r) => r === null)) return;

        const urlMap = new Map(results.map((r) => [r!.tempId, r!.realUrl]));
        finalImages = finalImages.map((img) => ({ ...img, url: urlMap.get(img.url) ?? img.url }));
      }

      const finalData = { ...data, images: finalImages };
      const result = isEdit
        ? await updateProduct(productId, finalData)
        : await createProduct(finalData);

      if (result?.error) {
        for (const [field, messages] of Object.entries(result.error)) {
          setError(field as keyof AdminProductInput, { message: (messages as string[])[0] });
        }
      }
    });
  };

  const handleFileUpload = (file: File) => {
    const tempId = `pending:${uid()}`;
    const preview = URL.createObjectURL(file);
    setPendingFiles((prev) => new Map(prev).set(tempId, { file, preview }));
    appendImage({ url: tempId, alt: '', isPrimary: imageFields.length === 0, sortOrder: imageFields.length });
  };

  const handleSetPrimary = (primaryIdx: number) => {
    imageFields.forEach((_, idx) => setValue(`images.${idx}.isPrimary`, idx === primaryIdx));
  };

  const handleGenerateVariants = () => {
    const hasGroups = attrSets.some((set) => set.groups.some((g) => g.name.trim() && g.values.length > 0));
    if (!hasGroups) return;
    if (variantFields.length > 0 && !confirm(t.admin.replaceVariantsConfirm)) return;

    const slug = watch('slug') || 'product';
    const allVariantAttrs: Record<string, string>[] = [];

    for (const set of attrSets) {
      const validGroups = set.groups.filter((g) => g.name.trim() && g.values.length > 0);
      if (validGroups.length === 0) continue;
      const combos = cartesianProduct(validGroups.map((g) => g.values));
      for (const combo of combos) {
        const attrs: Record<string, string> = {};
        validGroups.forEach((g, gi) => { attrs[g.name.toLowerCase()] = combo[gi]!; });
        allVariantAttrs.push(attrs);
      }
    }

    replaceVariants(
      allVariantAttrs.map((attrs, i) => ({
        sku: `${slug}-${i + 1}`,
        attributes: attrs,
        stockCount: 0,
        priceOverrideEgp: null,
        imageUrl: null,
      }))
    );
  };

  const attrKeys = variantFields.length > 0
    ? Object.keys(variantFields[0]?.attributes ?? {})
    : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-12">

      {/* Basic Info */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
          {t.admin.basicInfo}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{t.admin.nameEn}</label>
            <input
              {...register('name', {
                onChange: (e) => { if (!isEdit) setValue('slug', slugify(e.target.value)); },
              })}
              className={inputCls}
              placeholder="Product name"
            />
            {errors.name && <p className={errorCls}>{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelCls}>
              الاسم (عربي) <span className="text-gray-400 font-normal text-xs">Arabic Name</span>
            </label>
            <input {...register('nameAr')} dir="rtl" className={inputCls} placeholder="اسم المنتج بالعربية" />
          </div>
          <div>
            <label className={labelCls}>{t.admin.brandLabel}</label>
            <select {...register('brand')} className={inputCls}>
              <option value="">{t.admin.selectBrand}</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
            {errors.brand && <p className={errorCls}>{errors.brand.message}</p>}
          </div>
          <div>
            <label className={labelCls}>{t.admin.genderLabel}</label>
            <select {...register('gender')} className={inputCls}>
              <option value="ALL">{t.admin.genderAll}</option>
              <option value="MALE">{t.admin.genderMale}</option>
              <option value="FEMALE">{t.admin.genderFemale}</option>
              <option value="KIDS">{t.admin.genderKids}</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>{t.admin.slugFull}</label>
            <input {...register('slug')} className={inputCls} placeholder="product-slug" />
            {errors.slug && <p className={errorCls}>{errors.slug.message}</p>}
          </div>
          <div>
            <label className={labelCls}>{t.admin.modelNumber}</label>
            <input {...register('modelNumber')} className={inputCls} placeholder="e.g. XYZ-1234" />
          </div>
          <div>
            <label className={labelCls}>{t.admin.categoryLabel}</label>
            <select {...register('categoryId')} className={inputCls}>
              <option value="">{t.admin.selectCategory}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className={errorCls}>{errors.categoryId.message}</p>}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{t.admin.descriptionEn}</label>
            <textarea
              {...register('description')}
              rows={4}
              className={inputCls}
              placeholder="Product description..."
            />
            {errors.description && <p className={errorCls}>{errors.description.message}</p>}
          </div>
          <div>
            <label className={labelCls}>
              الوصف (عربي) <span className="text-gray-400 font-normal text-xs">Arabic Description</span>
            </label>
            <textarea
              {...register('descriptionAr')}
              dir="rtl"
              rows={4}
              className={inputCls}
              placeholder="وصف المنتج بالعربية..."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">{t.admin.pricing}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>{t.admin.basePrice}</label>
            <input
              {...register('basePriceEgp')}
              type="number"
              step="0.01"
              min="0"
              className={inputCls}
              placeholder="0.00"
            />
            {errors.basePriceEgp && <p className={errorCls}>{errors.basePriceEgp.message}</p>}
          </div>
          <div>
            <label className={labelCls}>{t.admin.discountPercent}</label>
            <input
              {...register('discountPercent')}
              type="number"
              min="0"
              max="99"
              className={inputCls}
              placeholder="e.g. 20"
            />
          </div>
        </div>
      </section>

      {/* Settings */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">{t.admin.settings}</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" {...register('isActive')} className="w-4 h-4 accent-primary rounded" />
            <span className="text-sm text-gray-700">{t.admin.activeVisible}</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 accent-primary rounded" />
            <span className="text-sm text-gray-700">{t.admin.featuredHomepage}</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" {...register('isHolidayOffer')} className="w-4 h-4 accent-primary rounded" />
            <span className="text-sm text-gray-700">{t.admin.holidayOffer}</span>
          </label>
        </div>
      </section>

      {/* Specs */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{t.admin.specifications}</h2>
          <button
            type="button"
            onClick={() => appendSpec({ key: '', keyAr: '', value: '', valueAr: '' })}
            className="flex items-center gap-1 text-xs text-primary-btn font-medium hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> {t.admin.addSpec}
          </button>
        </div>
        <div className="space-y-3">
          {specFields.map((field, i) => (
            <div key={field.id} className="border border-gray-100 rounded-md p-3 space-y-2 bg-gray-50/50">
              <div className="flex gap-2 items-center">
                <span className="text-xs font-medium text-gray-400 w-6 shrink-0">EN</span>
                <input {...register(`specs.${i}.key`)} className={inputCls} placeholder="Key (e.g. Material)" />
                <input {...register(`specs.${i}.value`)} className={inputCls} placeholder="Value (e.g. Nylon)" />
                <button
                  type="button"
                  onClick={() => removeSpec(i)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-xs font-medium text-amber-500 w-6 shrink-0">ع</span>
                <input {...register(`specs.${i}.keyAr`)} dir="rtl" className={inputCls} placeholder="مثلاً: المادة" />
                <input {...register(`specs.${i}.valueAr`)} dir="rtl" className={inputCls} placeholder="مثلاً: نايلون" />
                <div className="w-9 shrink-0" />
              </div>
            </div>
          ))}
          {specFields.length === 0 && (
            <p className="text-sm text-gray-400 italic">{t.admin.noSpecsYet}</p>
          )}
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">{t.admin.images}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {imageFields.map((field, i) => {
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
                  onClick={() => {
                    if (field.url.startsWith('pending:')) {
                      setPendingFiles((prev) => {
                        const next = new Map(prev);
                        const p = next.get(field.url);
                        if (p) URL.revokeObjectURL(p.preview);
                        next.delete(field.url);
                        return next;
                      });
                    }
                    removeImage(i);
                  }}
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
      </section>

      {/* Variants */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-1 uppercase tracking-wide">{t.admin.variants}</h2>
        <p className="text-xs text-gray-400 mb-5">
          {t.admin.variantsDesc}
        </p>

        {/* Variant sets */}
        <div className="space-y-4 mb-4">
          {attrSets.map((set, setIdx) => (
            <div key={set.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t.admin.variantSetLabel(setIdx + 1)}
                </p>
                <button
                  type="button"
                  onClick={() => setAttrSets((prev) => prev.filter((s) => s.id !== set.id))}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  {t.admin.delete}
                </button>
              </div>
              {set.groups.map((group) => (
                <AttrGroupRow
                  key={group.id}
                  group={group}
                  onChange={(updated) =>
                    setAttrSets((prev) => prev.map((s) =>
                      s.id === set.id ? { ...s, groups: s.groups.map((g) => g.id === group.id ? updated : g) } : s
                    ))
                  }
                  onRemove={() =>
                    setAttrSets((prev) => prev.map((s) =>
                      s.id === set.id ? { ...s, groups: s.groups.filter((g) => g.id !== group.id) } : s
                    ))
                  }
                  attrNamePlaceholder={t.admin.attrNamePlaceholder}
                  attrNameArPlaceholder={t.admin.attrNameArPlaceholder}
                  addValuePlaceholder={t.admin.addValue}
                  addLabel={t.admin.add}
                  addColorLabel={t.admin.addColor}
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  setAttrSets((prev) => prev.map((s) =>
                    s.id === set.id ? { ...s, groups: [...s.groups, { id: uid(), name: '', nameAr: '', type: 'text', values: [] }] } : s
                  ))
                }
                className="flex items-center gap-1.5 text-sm text-primary-btn font-medium hover:underline"
              >
                <Plus className="w-4 h-4" /> {t.admin.addAttribute}
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setAttrSets((prev) => [...prev, { id: uid(), groups: [] }])}
            className="flex items-center gap-1.5 text-sm text-gray-600 font-medium hover:underline border border-dashed border-gray-300 rounded-md px-3 py-2 hover:border-gray-400 transition-colors"
          >
            <Plus className="w-4 h-4" /> {t.admin.addVariantSet}
          </button>
        </div>

        {attrSets.length > 0 && (
          <button
            type="button"
            onClick={handleGenerateVariants}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors mb-6"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t.admin.generateVariants}
          </button>
        )}

        {/* Variants table */}
        {variantFields.length > 0 ? (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {attrKeys.map((key) => (
                    <th key={key} className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase capitalize">
                      {key}
                    </th>
                  ))}
                  <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase">{t.admin.stockHeader}</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase whitespace-nowrap">{t.admin.priceOverride}</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase">{t.admin.skuHeader}</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {variantFields.map((field, i) => (
                  <tr key={field.id} className="hover:bg-gray-50">
                    {attrKeys.map((key) => {
                      const val = field.attributes?.[key] ?? '';
                      return (
                        <td key={key} className="px-3 py-2">
                          {isHex(val) ? (
                            <div className="flex items-center gap-2">
                              <span
                                className="w-5 h-5 rounded-full border border-gray-200 shrink-0"
                                style={{ backgroundColor: val }}
                              />
                              <span className="text-xs font-mono text-gray-500">{val}</span>
                            </div>
                          ) : (
                            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2">
                      <input
                        {...register(`variants.${i}.stockCount`)}
                        type="number"
                        min="0"
                        className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        {...register(`variants.${i}.priceOverrideEgp`)}
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-28 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder="Optional"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        {...register(`variants.${i}.sku`)}
                        className="w-36 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder="SKU"
                      />
                      {errors.variants?.[i]?.sku && (
                        <p className={errorCls}>{errors.variants[i]?.sku?.message}</p>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">
            {t.admin.noVariantsYet}
          </p>
        )}
      </section>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-btn text-white rounded-md text-sm font-semibold hover:bg-primary-btn/90 disabled:opacity-60 transition-colors"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? t.admin.updateProduct : t.admin.createProduct}
        </button>
        <a
          href="/admin/products"
          className="px-5 py-2.5 border border-gray-300 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          {t.admin.cancel}
        </a>
      </div>
    </form>
  );
}
