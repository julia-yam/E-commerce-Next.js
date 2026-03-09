import type { Metadata } from "next";
import CartPageClient from "./CartPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your electronics, shoes, and furniture before checkout.",
};

export default function CartPage() {
  return (
    <main>
      <CartPageClient />
    </main>
  );
}
