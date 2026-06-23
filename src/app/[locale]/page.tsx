import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getHeroSettings } from "@/lib/data/hero";
import { HeroSection } from "@/components/hero/HeroSection";
import { HomeSections } from "@/components/home/HomeSections";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    path: "",
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const heroSettings = await getHeroSettings();

  return (
    <>
      <HeroSection locale={locale} settings={heroSettings} />
      <HomeSections locale={locale} />
    </>
  );
}
