"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {Text} from "@components/index";

import styles from "./CategoriesPage.module.scss";

interface CategoryWithImage {
  id: string;
  title: string;
  image: string | null;
  productsCount: number;
}

interface CategoriesClientProps {
  categories: CategoryWithImage[];
}

const CategoriesClient: React.FC<CategoriesClientProps> = ({ categories }) => {
  return (
    <div className={styles.categoriesPage}>
      <Text
        tag="h1"
        view="title"
        weight="bold"
        color="primary"
        className={styles.pageTitle}
      >
        Categories
      </Text>

      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/product-page?category=${category.id}`}
            className={styles.categoryCard}
          >
            <div className={styles.imageWrapper}>
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className={styles.placeholder}>
                  <Text view="p-14" color="secondary">
                    No image
                  </Text>
                </div>
              )}
            </div>

            <div className={styles.categoryInfo}>
              <Text tag="h3" view="p-20" weight="bold" color="primary">
                {category.title}
              </Text>
              <Text tag="span" view="p-14" color="secondary">
                {category.productsCount} items
              </Text>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesClient;
