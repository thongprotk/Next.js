import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { languages } from "@/i18n/settings";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Base URL để resolve các URL tương đối trong openGraph/twitter images ở mọi
  // route con — chỉ cần set 1 lần ở đây, không lặp lại ở từng layout/page con.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Quản lý Bán hàng",
    template: "%s | Quản lý Bán hàng",
  },
  description: "Quản lý sản phẩm, bán hàng, nhập hàng, chi tiêu và thuế VAT.",
};

export function generateStaticParams() {
  return languages.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col`}>
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-120 bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-accent),transparent_70%)] opacity-60"
        />
        <TooltipProvider>
          <SiteHeader locale={locale} />
          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
            {children}
          </main>
          <SiteFooter locale={locale} />
        </TooltipProvider>
      </body>
    </html>
  );
}
