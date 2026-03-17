import type { Metadata } from "next";
import RegisterPageClient from "./RegisterPageClient";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account in our store",
};

export default function RegisterPage() {
  return (
    <main>
      <RegisterPageClient />
    </main>
  );
}
