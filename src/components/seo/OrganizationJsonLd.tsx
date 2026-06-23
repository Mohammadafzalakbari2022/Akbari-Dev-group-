import { getSiteUrl } from "@/lib/seo/metadata";
import type { SiteSettings } from "@/lib/data/site-settings";

type OrganizationJsonLdProps = {
  locale: string;
  settings: SiteSettings;
};

export function OrganizationJsonLd({
  locale,
  settings,
}: OrganizationJsonLdProps) {
  const baseUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Akbari Dev Group",
    alternateName: [
      "گروه توسعه اکبری",
      "د اکبري پراختیاګروپ",
    ],
    url: `${baseUrl}/${locale}`,
    logo: settings.logo || `${baseUrl}/icons/icon.svg`,
    description:
      locale === "fa"
        ? "همه محصولات ما در یک مکان — ساده، سریع، قابل اعتماد"
        : locale === "ps"
          ? "زموږ ټول محصولات په یوه ځای — ساده، چټک، باوري"
          : "All our products in one place — simple, fast, trusted",
    ...(settings.contact.email
      ? { email: settings.contact.email }
      : {}),
    ...(settings.contact.phone
      ? { telephone: settings.contact.phone }
      : {}),
    sameAs: settings.social
      .map((s) => s.url?.trim())
      .filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
