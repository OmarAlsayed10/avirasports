export type FilterCategory = { slug: string; name: string; nameAr?: string | null };

export interface FilterDrawerProps {
  categories: FilterCategory[];
  brands: string[];
}
