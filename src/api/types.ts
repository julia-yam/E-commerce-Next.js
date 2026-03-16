import { type Option } from "@components/Search/configs";

export interface StrapiProductFilters {
  title?: { $containsi: string };
  productCategory?: { documentId: { $in: string[] } };
  price?: {
    $gte?: number;
    $lte?: number;
  };
  discountPercent?: { $gte: number };
  rating?: { $gte: number };
  isInStock?: { $eq: boolean };
}

export interface FormattedProduct {
  id: number;
  documentId: string;
  title: string;
  image: string;
  price: number;
  category: string;
  description: string;
  isInStock: boolean;
}

export interface PagedResponse<T> {
  items: T[];
  total: number;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      start: number;
      limit: number;
      total: number;
    };
  };
}

export interface CategoryAttributes {
  title?: string;
  name?: string;
}

export interface ProductAttributes {
  title: string;
  price: number;
  description: string;
  isInStock: boolean;
  images: unknown;
  productCategory: unknown;
}

export { type Option };
