"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { usePathname, useSearchParams } from "next/navigation";
import { Virtuoso } from "react-virtuoso";

import ProductListStore from "@store/ProductListStore";
import { Search } from "@components/index";
import { ProductRow } from "./components/ProductRow";
import { InfoProducts } from "./components/InfoProducts";
import { type FormattedProduct } from "@/app/api/types";

import styles from "./ProductPage.module.scss";

const SKELETON_ROWS_COUNT = 3;

interface ProductsResponse {
  items: FormattedProduct[];
  total: number;
}

interface Props {
  initialSearch: string;
  initialCategories: string[];
  initialData: ProductsResponse;
}

const ProductPageClient = observer(
  ({ initialSearch, initialCategories, initialData }: Props) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [store] = useState(() => new ProductListStore());
    const isInitialized = useRef(false);

    const isInitialLoading =
      store.isLoading && (store.products?.length || 0) === 0;
    const loadedRowsCount = Math.ceil(
      (store.products?.length || 0) / store.columnsCount,
    );

    const totalRowCount = isInitialLoading
      ? SKELETON_ROWS_COUNT
      : store.hasMore
        ? loadedRowsCount + 1
        : loadedRowsCount;

    const categoryKeys = store.filters.selectedCategories
      .map((c) => c.key)
      .sort()
      .join(",");

    const loadMore = useCallback(() => {
      if (!store.isLoading && store.hasMore) {
        void store.fetchNextPage();
      }
    }, [store]);

    useEffect(() => {
      store.setWindowWidth(window.innerWidth);
      const handleResize = () => store.setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [store]);

    useEffect(() => {
      if (!isInitialized.current) {
        void store.init(initialSearch, initialCategories, initialData);
        isInitialized.current = true;
      }

      return () => {
        store.destroy();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (!isInitialized.current) return;

      const newParams = new URLSearchParams();

      if (store.filters.searchQuery) {
        newParams.set("search", store.filters.searchQuery);
      }

      if (categoryKeys) {
        categoryKeys
          .split(",")
          .filter(Boolean)
          .forEach((key) => newParams.append("category", key));
      }

      const queryString = newParams.toString();
      const currentQueryString = searchParams.toString();

      if (currentQueryString !== queryString) {
        const url = queryString ? `${pathname}?${queryString}` : pathname;
        window.history.replaceState(null, "", url);
      }
    }, [store.filters.searchQuery, categoryKeys, pathname, searchParams]);

    return (
      <div className={styles.productPage}>
        <InfoProducts className={styles.infoProduct} />
        <div className={styles.searchProduct}>
          <Search
            options={store.categories}
            selectedOptions={store.filters.selectedCategories}
            onFilterChange={(options) =>
              store.filters.setSelectedCategories(options)
            }
            searchQuery={store.filters.searchQuery}
            onSearchChange={(value) => store.filters.setSearchQuery(value)}
            totalCount={store.total}
            advancedFilters={store.filters.advancedFilters}
            onAdvancedFilterChange={store.filters.setAdvancedFilter}
            className={styles.search}
          />
          <div className={styles.listWrapper}>
            <Virtuoso
              useWindowScroll
              totalCount={totalRowCount}
              endReached={loadMore}
              itemContent={(index) => (
                <ProductRow index={index} store={store} />
              )}
            />
          </div>
        </div>
      </div>
    );
  },
);

export default ProductPageClient;
