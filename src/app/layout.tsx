import React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "./providers";
import QueryProvider from "@/providers/QueryProvider";
import { StoreProvider } from "@/providers/StoreProvider";
import { roboto } from "@styles/Roboto/fonts";
import "@styles/styles.scss";

export const metadata: Metadata = {
  title: {
    template: "%s | Lalasia",
    default: "Lalasia | Online Store",
  },
  description: "Shop electronics, shoes, furniture, and much more.",
  keywords: [
    "furniture",
    "electronics",
    "shoes",
    "miscellaneous",
    "interior design",
    "minimalism",
    "Lalasia",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <StoreProvider>{children}</StoreProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
