"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";
import { ArrowDownIcon, Input } from "@components/index";
import {
  getFilteredOptions,
  type MultiDropdownProps,
  type Option,
} from "./configs";
import styles from "./MultiDropdown.module.scss";

type ExtendedProps = MultiDropdownProps & {
  children?: React.ReactNode;
};

const MultiDropdown: React.FC<ExtendedProps> = ({
  className,
  options,
  value,
  onChange,
  disabled,
  getTitle,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    return getFilteredOptions(options, filter);
  }, [options, filter]);

  const handleOptionClick = (option: Option) => {
    const isSelected = value.some((v) => v.key === option.key);
    if (isSelected) {
      onChange(value.filter((v) => v.key !== option.key));
    } else {
      onChange([...value, option]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setIsOpen(false);
      event.currentTarget.blur();
    }
  };

  const displayValue = isOpen
    ? filter
    : value.length > 0
      ? getTitle(value)
      : "";

  return (
    <div className={cn(styles.multiDropdown, className)} ref={rootRef}>
      <Input
        disabled={disabled}
        placeholder={getTitle(value) || "Фильтры и категории"}
        value={displayValue}
        onChange={(val: string) => {
          setFilter(val);
          if (val) {
            setIsCategoriesOpen(true);
          }
        }}
        onFocus={() => !disabled && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        afterSlot={<ArrowDownIcon color="secondary" />}
      />

      {isOpen && !disabled && (
        <div className={cn(styles.multiDropdownOptions, styles.viewP16)}>
          {options.length > 0 && (
            <div className={styles.categoriesAccordion}>
              <div
                className={styles.categoriesHeader}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCategoriesOpen(!isCategoriesOpen);
                }}
              >
                <span className={styles.categoriesTitle}>Категории</span>
                <ArrowDownIcon
                  color="secondary"
                  className={cn(styles.accordionIcon, {
                    [styles.accordionIconOpen]: isCategoriesOpen,
                  })}
                />
              </div>

              {isCategoriesOpen && (
                <div className={styles.optionsList}>
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => {
                      const isSelected = value.some(
                        (v) => v.key === option.key,
                      );
                      return (
                        <div
                          key={option.key}
                          className={cn(styles.multiDropdownItem, {
                            [styles.multiDropdownItemSelected]: isSelected,
                          })}
                          onClick={() => handleOptionClick(option)}
                        >
                          {option.value}
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles.noResults}>Ничего не найдено</div>
                  )}
                </div>
              )}
            </div>
          )}

          {children && <div className={styles.extraFilters}>{children}</div>}
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;
