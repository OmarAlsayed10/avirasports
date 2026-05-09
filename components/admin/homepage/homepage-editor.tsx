'use client';

import { useTransition, useState } from 'react';
import { Eye, EyeOff, ChevronUp, ChevronDown, Trash2, Plus, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLocale } from '@/lib/i18n/context';
import {
  toggleSectionVisibility,
  updateSectionConfig,
  moveSectionUp,
  moveSectionDown,
  addCategorySection,
  deleteCategorySection,
} from '@/lib/server-actions/admin/homepage';

type SectionType = 'FEATURED' | 'BEST_VALUE' | 'HOLIDAY_OFFERS' | 'CATEGORY_SHOWCASE';

type Section = {
  id: string;
  type: SectionType;
  title: string;
  titleAr: string | null;
  isVisible: boolean;
  sortOrder: number;
  productLimit: number;
  categoryId: string | null;
  category: { id: string; slug: string; name: string; nameAr: string | null } | null;
};

type Category = {
  id: string;
  name: string;
  nameAr: string | null;
};

const TYPE_COLORS: Record<SectionType, string> = {
  FEATURED: 'bg-yellow-100 text-yellow-800',
  BEST_VALUE: 'bg-green-100 text-green-800',
  HOLIDAY_OFFERS: 'bg-red-100 text-red-800',
  CATEGORY_SHOWCASE: 'bg-blue-100 text-blue-800',
};

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary';

function SectionRow({
  section,
  isFirst,
  isLast,
  allCategories,
}: {
  section: Section;
  isFirst: boolean;
  isLast: boolean;
  allCategories: Category[];
}) {
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [titleAr, setTitleAr] = useState(section.titleAr ?? '');
  const [categoryId, setCategoryId] = useState(section.categoryId ?? '');
  const [productLimit, setProductLimit] = useState(section.productLimit);
  const { t } = useLocale();

  const TYPE_LABELS: Record<SectionType, string> = {
    FEATURED: t.admin.typeFeatured,
    BEST_VALUE: t.admin.typeBestValue,
    HOLIDAY_OFFERS: t.admin.typeHolidayOffers,
    CATEGORY_SHOWCASE: t.admin.typeCategory,
  };

  function handleToggle() {
    startTransition(async () => {
      await toggleSectionVisibility(section.id, !section.isVisible);
      toast.success(section.isVisible ? t.admin.sectionHiddenToast : t.admin.sectionVisibleToast);
    });
  }

  function handleMoveUp() {
    startTransition(async () => { await moveSectionUp(section.id); });
  }

  function handleMoveDown() {
    startTransition(async () => { await moveSectionDown(section.id); });
  }

  function handleSave() {
    startTransition(async () => {
      await updateSectionConfig(section.id, {
        title: title.trim() || section.title,
        titleAr: titleAr.trim() || undefined,
        categoryId: section.type === 'CATEGORY_SHOWCASE' ? (categoryId || null) : undefined,
        productLimit: Math.max(1, Math.min(20, productLimit)),
      });
      setEditing(false);
      toast.success(t.admin.sectionUpdated);
    });
  }

  function handleDelete() {
    if (!confirm(t.admin.removeSectionConfirm)) return;
    startTransition(async () => {
      const result = await deleteCategorySection(section.id);
      if (result?.error) toast.error(result.error);
      else toast.success(t.admin.sectionRemoved);
    });
  }

  return (
    <div className={`bg-white rounded-lg border ${editing ? 'border-primary/40' : 'border-gray-200'} overflow-hidden`}>
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Reorder */}
        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            onClick={handleMoveUp}
            disabled={isFirst || pending}
            className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={t.admin.moveUp}
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={handleMoveDown}
            disabled={isLast || pending}
            className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={t.admin.moveDown}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Type badge */}
        <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[section.type]}`}>
          {TYPE_LABELS[section.type]}
        </span>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {t.dir === 'rtl' && section.titleAr ? section.titleAr : section.title}
          </p>
          {section.type === 'CATEGORY_SHOWCASE' && section.category && (
            <p className="text-xs text-gray-400">
              {t.dir === 'rtl' && section.category.nameAr ? section.category.nameAr : section.category.name}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {pending && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}

          <button
            onClick={handleToggle}
            disabled={pending}
            title={section.isVisible ? t.admin.hideSectionTitle : t.admin.showSectionTitle}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              section.isVisible
                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {section.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {section.isVisible ? t.admin.sectionVisible : t.admin.sectionHidden}
          </button>

          <button
            onClick={() => setEditing((v) => !v)}
            className="px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {editing ? t.admin.cancel : t.admin.edit}
          </button>

          {section.type === 'CATEGORY_SHOWCASE' && (
            <button
              onClick={handleDelete}
              disabled={pending}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30"
              aria-label={t.admin.removeSection}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Edit panel */}
      {editing && (
        <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t.admin.titleEnLabel}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t.admin.titleArLabel}</label>
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                dir="rtl"
                className={inputCls}
              />
            </div>
          </div>

          {section.type === 'CATEGORY_SHOWCASE' && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t.admin.typeCategory}</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={inputCls}
              >
                <option value="">{t.admin.selectCategoryToAdd}</option>
                {allCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {t.dir === 'rtl' && c.nameAr ? c.nameAr : c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="w-32">
            <label className="block text-xs font-medium text-gray-600 mb-1">{t.admin.productsShownLabel}</label>
            <input
              type="number"
              min={1}
              max={20}
              value={productLimit}
              onChange={(e) => setProductLimit(Number(e.target.value))}
              className={inputCls}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={pending}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-btn text-white rounded-md text-sm font-medium hover:bg-primary-btn/90 transition-colors disabled:opacity-50"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t.admin.save}
          </button>
        </div>
      )}
    </div>
  );
}

function AddCategorySection({ allCategories, usedCategoryIds }: { allCategories: Category[]; usedCategoryIds: Set<string> }) {
  const [pending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState('');
  const available = allCategories.filter((c) => !usedCategoryIds.has(c.id));
  const { t } = useLocale();

  function handleAdd() {
    if (!selectedId) return;
    startTransition(async () => {
      const result = await addCategorySection(selectedId);
      if (result?.error) toast.error(result.error);
      else {
        toast.success(t.admin.categorySectionAdded);
        setSelectedId('');
      }
    });
  }

  if (available.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <option value="">{t.admin.selectCategoryToAdd}</option>
        {available.map((c) => (
          <option key={c.id} value={c.id}>
            {t.dir === 'rtl' && c.nameAr ? c.nameAr : c.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleAdd}
        disabled={!selectedId || pending}
        className="flex items-center gap-1.5 px-4 py-2 bg-primary-btn text-white rounded-md text-sm font-medium hover:bg-primary-btn/90 transition-colors disabled:opacity-50"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        {t.admin.addSection}
      </button>
    </div>
  );
}

export function HomepageEditor({
  sections,
  allCategories,
}: {
  sections: Section[];
  allCategories: Category[];
}) {
  const { t } = useLocale();

  const usedCategoryIds = new Set(
    sections.filter((s) => s.type === 'CATEGORY_SHOWCASE' && s.categoryId).map((s) => s.categoryId!)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {sections.map((section, idx) => (
          <SectionRow
            key={section.id}
            section={section}
            isFirst={idx === 0}
            isLast={idx === sections.length - 1}
            allCategories={allCategories}
          />
        ))}
        {sections.length === 0 && (
          <p className="text-sm text-gray-400 italic py-4 text-center">
            {t.admin.noSectionsYet}
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{t.admin.addCategoryShowcase}</h3>
        <AddCategorySection allCategories={allCategories} usedCategoryIds={usedCategoryIds} />
      </div>
    </div>
  );
}
