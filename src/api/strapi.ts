import axios from "axios";
import qs from "qs";
import {
  type CategoryAttributes,
  type FormattedProduct,
  type Option,
  type PagedResponse,
  type ProductAttributes,
  type StrapiProductFilters,
  type StrapiResponse,
} from "./types";

import { type AdvancedFilters } from "@/shared/components/Search/configs";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "";
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";

if (!STRAPI_BASE_URL || !STRAPI_API_URL) {
  console.error("Missing Environment Variables for Strapi!");
}

interface StrapiItem<T = Record<string, unknown>> {
  id: number;
  documentId?: string;
  attributes?: T;
  [key: string]: unknown;
}

const api = axios.create({
  baseURL: STRAPI_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

const getAttrs = <T>(item: unknown): T => {
  if (item && typeof item === "object" && "attributes" in item) {
    return (item as { attributes: T }).attributes;
  }
  return item as T;
};

const getImageUrl = (images: unknown): string => {
  const data = (images as { data?: unknown })?.data ?? images;
  const target = Array.isArray(data) ? data[0] : data;
  if (target) {
    const attrs = getAttrs<{ url?: string }>(target);
    const url = attrs?.url;
    if (url) return url.startsWith("http") ? url : `${STRAPI_BASE_URL}${url}`;
  }
  return "";
};

const formatStrapiProduct = (
  item: StrapiItem<ProductAttributes>,
): FormattedProduct => {
  const attrs = getAttrs<ProductAttributes>(item);
  const categorySource =
    (attrs.productCategory as { data?: unknown })?.data ??
    attrs.productCategory;
  const categoryAttrs = getAttrs<CategoryAttributes>(categorySource);

  return {
    id: item.id,
    documentId: item.documentId || item.id.toString(),
    title: attrs.title || "No title",
    image: getImageUrl(attrs.images),
    price: attrs.price || 0,
    category: categoryAttrs?.title || categoryAttrs?.name || "No category",
    description: attrs.description || "",
    isInStock: attrs.isInStock,
  };
};

export const strapiService = {
  getProducts: async (
    start: number = 0,
    limit: number = 10,
    search: string = "",
    categoryIds: string[] = [],
    advancedFilters?: AdvancedFilters,
  ): Promise<PagedResponse<FormattedProduct>> => {
    const filters: StrapiProductFilters = {};

    if (search) filters.title = { $containsi: search };

    if (categoryIds.length > 0) {
      filters.productCategory = { documentId: { $in: categoryIds } };
    }

    if (advancedFilters) {
      if (advancedFilters.priceMin || advancedFilters.priceMax) {
        filters.price = {};
        if (advancedFilters.priceMin)
          filters.price.$gte = Number(advancedFilters.priceMin);
        if (advancedFilters.priceMax)
          filters.price.$lte = Number(advancedFilters.priceMax);
      }

      if (advancedFilters.discountPercent) {
        filters.discountPercent = {
          $gte: Number(advancedFilters.discountPercent),
        };
      }

      if (advancedFilters.rating) {
        filters.rating = { $gte: Number(advancedFilters.rating) };
      }

      if (advancedFilters.isInStock) {
        filters.isInStock = { $eq: true };
      }
    }

    const query = qs.stringify(
      {
        populate: ["images", "productCategory"],
        pagination: { start, limit },
        filters,
      },
      { encodeValuesOnly: true },
    );

    const res = await fetch(`${STRAPI_API_URL}/products?${query}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`Fetch products failed: ${res.status}`);
    const data: StrapiResponse<StrapiItem<ProductAttributes>[]> =
      await res.json();

    return {
      items: (data.data || []).map(formatStrapiProduct),
      total: data.meta.pagination.total || 0,
    };
  },

  getCategories: async (): Promise<Option[]> => {
    const res = await fetch(`${STRAPI_API_URL}/product-categories`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`Fetch categories failed: ${res.status}`);
    const data: StrapiResponse<StrapiItem<CategoryAttributes>[]> =
      await res.json();

    return (data.data || []).map((item) => {
      const attrs = getAttrs<CategoryAttributes>(item);
      return {
        key: item.documentId || item.id.toString(),
        value: attrs.title || attrs.name || "",
      };
    });
  },

  getOneProduct: async (id: string): Promise<FormattedProduct | null> => {
    try {
      const query = qs.stringify(
        { populate: ["images", "productCategory"] },
        { encodeValuesOnly: true },
      );
      const { data } = await api.get<
        StrapiResponse<StrapiItem<ProductAttributes>>
      >(`/products/${id}?${query}`);
      return data.data ? formatStrapiProduct(data.data) : null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404)
        return null;
      throw error;
    }
  },

  getOneProductServer: async (id: string): Promise<FormattedProduct | null> => {
    const query = qs.stringify(
      { populate: ["images", "productCategory"] },
      { encodeValuesOnly: true },
    );

    const res = await fetch(`${STRAPI_API_URL}/products/${id}?${query}`, {
      next: { revalidate: 3600 },
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Fetch product failed: ${res.status}`);

    const responseData: StrapiResponse<StrapiItem<ProductAttributes>> =
      await res.json();
    return responseData.data ? formatStrapiProduct(responseData.data) : null;
  },
};
