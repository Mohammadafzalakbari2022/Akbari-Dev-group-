import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.reviews" });

  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    path: "/reviews",
  });
}

export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.reviews" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-text-muted">{t("description")}</p>
        <div className="mt-10 rounded-xl glass-panel p-8 text-center">
          <p className="text-text-muted">{tCommon("comingSoon")}</p>
          <Link
            href="/products"
            className="mt-4 inline-block text-sm text-accent-primary hover:underline"
          >
            →
          </Link>
        </div>
      </div>
    </div>
  );
}
