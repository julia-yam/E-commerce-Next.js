"use client";

import React, { useEffect, useState } from "react";
import cn from "classnames";
import {
  Button,
  CheckBox,
  Input,
  MultiDropdown,
  Text,
} from "@components/index";
import { getDropdownTitle, type SearchProps, TEXTS } from "./configs";
import styles from "./Search.module.scss";

const Search: React.FC<SearchProps> = ({
  className,
  options,
  selectedOptions,
  onFilterChange,
  searchQuery,
  onSearchChange,
  totalCount,
  advancedFilters,
  onAdvancedFilterChange,
}) => {
  const [localValue, setLocalValue] = useState(searchQuery);

  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery]);

  const handleSearch = () => {
    onSearchChange(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={cn(styles.search, className)}>
      <div className={styles.searchAndFilter}>
        <div className={styles.searchProduct}>
          <Input
            className={styles.searchInput}
            value={localValue}
            onChange={(val: string) => setLocalValue(val)}
            onKeyDown={handleKeyDown}
            placeholder={TEXTS.placeholder}
          />
          <Button
            className={styles.searchButton}
            type="button"
            onClick={handleSearch}
          >
            {TEXTS.button}
          </Button>
        </div>

        <div className={styles.searchFilter}>
          <MultiDropdown
            options={options}
            value={selectedOptions}
            onChange={onFilterChange}
            getTitle={getDropdownTitle}
          >
            <div className={styles.advancedFiltersGroup}>
              <div className={styles.divider} />

              <Text view="p-16" weight="bold">
                Price
              </Text>
              <div className={styles.rangeInputs}>
                <Input
                  placeholder="From"
                  value={advancedFilters?.priceMin || ""}
                  onChange={(val) => onAdvancedFilterChange?.("priceMin", val)}
                />
                <Input
                  placeholder="To"
                  value={advancedFilters?.priceMax || ""}
                  onChange={(val) => onAdvancedFilterChange?.("priceMax", val)}
                />
              </div>

              <Text view="p-16" weight="bold">
                Discount (%)
              </Text>
              <Input
                placeholder="Min. discount"
                value={advancedFilters?.discountPercent || ""}
                onChange={(val) =>
                  onAdvancedFilterChange?.("discountPercent", val)
                }
              />

              <label className={styles.checkboxLabel}>
                <CheckBox
                  checked={advancedFilters?.isInStock || false}
                  onChange={(checked: boolean) =>
                    onAdvancedFilterChange?.("isInStock", checked)
                  }
                />
                <Text view="p-16">In stock</Text>
              </label>
            </div>
          </MultiDropdown>
        </div>
      </div>

      <div className={styles.searchTotal}>
        <Text
          className={styles.searchTextTotal}
          view="title"
          weight="bold"
          color="primary"
        >
          {TEXTS.totalLabel}
        </Text>
        <Text
          className={styles.searchNumber}
          view="p-20"
          color="accent"
          weight="bold"
        >
          {totalCount}
        </Text>
      </div>
    </div>
  );
};

export default Search;
