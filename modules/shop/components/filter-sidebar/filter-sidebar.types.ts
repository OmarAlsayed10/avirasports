export type FilterCategory = { slug: string; name: string; nameAr?: string | null };

export interface FilterSidebarProps {
  categories: FilterCategory[];
  brands: string[];
}
