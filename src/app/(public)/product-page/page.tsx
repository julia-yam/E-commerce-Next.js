import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";
import { strapiService } from "@/app/api/strapi";

export const revalidate = 60;

interface PageProps {
  params: Promise<Record<string, never>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search;
  const query = typeof search === "string" ? search : "";

  return {
    title: query ? `Search: ${query}` : "Catalog",
    description:
      "Browse our exclusive collection of electronics, shoes, and furniture.",
  };
}

export default async function ProductsPage({
  searchParams,
  params,
}: PageProps) {
  await params;
  const resolvedParams = await searchParams;

  const initialSearch =
    typeof resolvedParams?.search === "string" ? resolvedParams.search : "";

  const categoryParam = resolvedParams?.category;
  const initialCategories = Array.isArray(categoryParam)
    ? categoryParam
    : typeof categoryParam === "string"
      ? [categoryParam]
      : [];

  const initialData = await strapiService.getProducts(
    0,
    9,
    initialSearch,
    initialCategories,
  );

  return (
    <main>
      <ProductPageClient
        initialSearch={initialSearch}
        initialCategories={initialCategories}
        initialData={initialData}
      />
    </main>
  );
}
