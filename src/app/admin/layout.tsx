import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin — Akbari Dev Group",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="min-h-dvh antialiased font-en">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
