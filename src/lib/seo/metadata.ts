import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

const siteName = "Akbari Dev Group";

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://akbaridev.com"
  );
}

type PageMetaInput = {
  locale: string;
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function buildPageMetadata({
  locale,
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: PageMetaInput): Metadata {
  const baseUrl = getSiteUrl();
  const url = `${baseUrl}/${locale}${path}`;
  const ogImage = image ?? `${baseUrl}/opengraph-image`;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${baseUrl}/${loc}${path}`;
  }

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type: "website",
      locale: locale === "fa" ? "fa_AF" : locale === "ps" ? "ps_AF" : "en_US",
      url,
      siteName,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
