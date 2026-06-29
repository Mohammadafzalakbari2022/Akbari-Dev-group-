import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPublishedTestimonials } from "@/lib/data/testimonials";
import { pickLocale } from "@/lib/i18n-json";
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
  const testimonials = await getPublishedTestimonials();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-text-muted">{t("description")}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <article key={item.id} className="rounded-xl glass-panel p-6">
              <p className="text-sm text-accent-primary">
                “{pickLocale(item.quoteJson, locale)}”
              </p>
              <div className="mt-4">
                <p className="font-semibold text-text-primary">{item.authorName}</p>
                <p className="text-sm text-text-muted">
                  {pickLocale(item.roleJson, locale)}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/products"
            className="text-sm text-accent-primary hover:underline"
          >
            {t("title")} →
          </Link>
        </div>
      </div>
    </div>
  );
}
