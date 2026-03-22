export type Option = {
  key: string;
  value: string;
};

export interface AdvancedFilters {
  priceMin: string;
  priceMax: string;
  discountPercent: string;
  rating: string;
  isInStock: boolean;
}

export type SearchProps = {
  className?: string;
  options: Option[];
  selectedOptions: Option[];
  onFilterChange: (selected: Option[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;

  advancedFilters?: AdvancedFilters;
  onAdvancedFilterChange?: <K extends keyof AdvancedFilters>(
    key: K,
    value: AdvancedFilters[K],
  ) => void;
};

export const TEXTS = {
  placeholder: "Search product",
  button: "Find now",
  totalLabel: "Total products",
  filterDefault: "Filter",
};

export const getDropdownTitle = (selected: Option[]): string => {
  if (selected.length === 0) return TEXTS.filterDefault;
  return selected.map((option) => option.value).join(", ");
};
