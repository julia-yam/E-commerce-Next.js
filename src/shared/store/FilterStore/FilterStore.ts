import type { IReactionDisposer } from "mobx";
import { action, computed, makeObservable, observable, reaction } from "mobx";

import { type FormattedProduct } from "@/app/api/types";
import { type Option } from "@components/Search/configs";
import ProductListStore from "@store/ProductListStore";

export interface AdvancedFilters {
  priceMin: string;
  priceMax: string;
  discountPercent: string;
  rating: string;
  isInStock: boolean;
}

const defaultAdvancedFilters: AdvancedFilters = {
  priceMin: "",
  priceMax: "",
  discountPercent: "",
  rating: "",
  isInStock: false,
};

type PrivateFields =
  | "_searchQuery"
  | "_selectedCategories"
  | "_advancedFilters";

export default class FilterStore {
  private _searchQuery: string = "";
  private _selectedCategories: Option[] = [];
  private _advancedFilters: AdvancedFilters = { ...defaultAdvancedFilters };

  private readonly _reactionDisposer: IReactionDisposer;
  private _dataStore: ProductListStore;

  constructor(dataStore: ProductListStore) {
    this._dataStore = dataStore;

    makeObservable<FilterStore, PrivateFields>(this, {
      _searchQuery: observable,
      _selectedCategories: observable.ref,
      _advancedFilters: observable.deep,

      searchQuery: computed,
      selectedCategories: computed,
      advancedFilters: computed,
      filteredProducts: computed,

      setSearchQuery: action.bound,
      setSearchQueryOnly: action.bound,
      setSelectedCategories: action.bound,
      setAdvancedFilter: action.bound,
      resetAdvancedFilters: action.bound,
    });

    this._reactionDisposer = reaction(
      () => [this._selectedCategories, this._advancedFilters] as const,
      async () => {
        try {
          await this._dataStore.fetchData();
        } catch (error) {
          console.error(error);
        }
      },
      { delay: 300 },
    );
  }

  get searchQuery() {
    return this._searchQuery;
  }

  get selectedCategories() {
    return this._selectedCategories;
  }

  get advancedFilters() {
    return this._advancedFilters;
  }

  get filteredProducts(): FormattedProduct[] {
    return this._dataStore.products;
  }

  async setSearchQuery(value: string): Promise<void> {
    this._searchQuery = value;
    try {
      await this._dataStore.fetchData();
    } catch (error) {
      console.error(error);
    }
  }

  setSearchQueryOnly(value: string): void {
    this._searchQuery = value;
  }

  setSelectedCategories(categories: Option[]): void {
    this._selectedCategories = categories;
  }

  setAdvancedFilter<K extends keyof AdvancedFilters>(
    key: K,
    value: AdvancedFilters[K],
  ): void {
    this._advancedFilters = {
      ...this._advancedFilters,
      [key]: value,
    };
  }

  resetAdvancedFilters(): void {
    this._advancedFilters = { ...defaultAdvancedFilters };
  }

  destroy(): void {
    this._reactionDisposer();
  }
}
