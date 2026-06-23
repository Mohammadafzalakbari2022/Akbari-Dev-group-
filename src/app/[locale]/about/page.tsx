import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAboutSections, getTeamMembers } from "@/lib/data/pages";
import { getSiteSettings } from "@/lib/data/site-settings";
import { AboutContent } from "@/components/about/AboutContent";
import { SocialStrip } from "@/components/layout/SocialStrip";
import { QuickContact } from "@/components/contact/QuickContact";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });

  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    path: "/about",
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.about" });
  const [sections, team, settings] = await Promise.all([
    getAboutSections(),
    getTeamMembers(),
    getSiteSettings(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-text-muted">{t("description")}</p>
      </div>

      <AboutContent
        sections={sections}
        team={team}
        locale={locale}
        teamTitle={t("team")}
      />

      <div className="mt-16 space-y-8 border-t border-border pt-12">
        <SocialStrip
          links={settings.social}
          title={t("followUs")}
          showLabels
        />
        <QuickContact
          email={settings.contact.email}
          phone={settings.contact.phone}
          whatsapp={settings.contact.whatsapp}
          telegram={settings.contact.telegram}
        />
      </div>
    </div>
  );
}
