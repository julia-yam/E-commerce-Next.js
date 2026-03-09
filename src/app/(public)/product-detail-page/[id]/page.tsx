import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { strapiService } from "@/api/strapi";
import ProductDetailPageClient from "./ProductDetailPageClient";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const product = await strapiService.getOneProductServer(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.title,
    description: product.description
      ? product.description.slice(0, 150)
      : "High-quality item from our electronics, shoes, and furniture collection.",
    openGraph: {
      title: product.title,
      description: `Buy ${product.title} at Lalasia Online Store.`,
      images: [
        {
          url: product.image,
          alt: product.title,
        },
      ],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  const product = await strapiService.getOneProductServer(id);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <ProductDetailPageClient id={id} initialData={product} />
    </main>
  );
}
