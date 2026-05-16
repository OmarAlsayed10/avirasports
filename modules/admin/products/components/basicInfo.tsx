'use client';

import type { Category } from '@prisma/client';
import { useProductForm } from './product-form-provider';
import { SectionShell } from './sectionSheel';
import { slugify } from '@/modules/_shared/utils/slugify';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const errorCls = 'text-xs text-red-500 mt-1';

interface BasicInfoSectionProps {
  categories: Category[];
  brands: { id: string; name: string; slug: string }[];
}

export function BasicInfoSection({ categories, brands }: BasicInfoSectionProps) {
  const { form, isEdit } = useProductForm();
  const { register, setValue, formState: { errors } } = form;
  const { t } = useLocale();

  return (
    <SectionShell title={t.admin.basicInfo}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>{t.admin.nameEn}</label>
          <input
            {...register('name', {
              onChange: (e:any) => { if (!isEdit) setValue('slug', slugify(e.target.value)); },
            })}
            className={inputCls}
            placeholder={t.admin.productNamePlaceholder}
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
          <textarea {...register('description')} rows={4} className={inputCls} placeholder="Product description..." />
          {errors.description && <p className={errorCls}>{errors.description.message}</p>}
        </div>
        <div>
          <label className={labelCls}>
            الوصف (عربي) <span className="text-gray-400 font-normal text-xs">Arabic Description</span>
          </label>
          <textarea {...register('descriptionAr')} dir="rtl" rows={4} className={inputCls} placeholder="وصف المنتج بالعربية..." />
        </div>
      </div>
    </SectionShell>
  );
}
