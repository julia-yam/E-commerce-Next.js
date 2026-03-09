"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, MultiDropdown, Text } from "@components/index";
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
    <div className={`${styles.search} ${className || ""}`}>
      <div className={styles.searchAndFilter}>
        <div className={styles.searchProduct}>
          <Input
            className={styles.input}
            value={localValue}
            onChange={(val: string) => setLocalValue(val)}
            onKeyDown={handleKeyDown}
            placeholder={TEXTS.placeholder}
          />
          <Button
            className={styles.button}
            type="button"
            onClick={handleSearch}
          >
            {TEXTS.button}
          </Button>
        </div>

        <div className={styles.filter}>
          <MultiDropdown
            options={options}
            value={selectedOptions}
            onChange={onFilterChange}
            getTitle={getDropdownTitle}
          />
        </div>
      </div>

      <div className={styles.total}>
        <Text className={styles.textTotal} weight="bold">
          {TEXTS.totalLabel}
        </Text>
        <Text
          className={styles.number}
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
