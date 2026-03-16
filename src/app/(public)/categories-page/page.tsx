import React from "react";
import {strapiService} from "@/api/strapi";
import CategoriesClient from "./CategoriesPageClient";

export const revalidate = 3600;

export default async function CategoriesPage() {
  const categories = await strapiService.getCategories();

  const categoriesWithImages = await Promise.all(
    categories.map(async (category) => {
      try {
        const productsResponse = await strapiService.getProducts(0, 1, "", [
          category.key,
        ]);
        const firstProduct = productsResponse.items[0];

        return {
          id: category.key,
          title: category.value,
          image: firstProduct?.image || null,
          productsCount: productsResponse.total,
        };
      } catch {
        console.error(`Failed to load image for category ${category.value}`);
        return {
          id: category.key,
          title: category.value,
          image: null,
          productsCount: 0,
        };
      }
    }),
  );

  return <CategoriesClient categories={categoriesWithImages} />;
}
