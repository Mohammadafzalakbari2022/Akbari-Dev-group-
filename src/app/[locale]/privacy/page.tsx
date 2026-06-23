import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getPageBySlug } from "@/lib/data/site-settings";
import { LegalPageContent } from "@/components/pages/LegalPageContent";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await getPageBySlug("privacy");
  if (!page || !page.published) notFound();

  return (
    <LegalPageContent
      titleJson={page.titleJson}
      contentJson={page.contentJson}
      locale={locale}
    />
  );
}
