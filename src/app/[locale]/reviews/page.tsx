import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Quote } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getPublishedTestimonials } from "@/lib/data/testimonials";
import { pickLocale } from "@/lib/i18n-json";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { RemoteImage } from "@/components/ui/RemoteImage";

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
              <Quote className="h-6 w-6 text-accent-primary/40 mb-3" />
              <p className="text-sm text-text-primary leading-relaxed">
                “{pickLocale(item.quoteJson, locale)}”
              </p>
              <div className="mt-4 flex items-center gap-3">
                {item.avatarUrl ? (
                  <RemoteImage
                    src={item.avatarUrl}
                    alt={item.authorName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-primary/15 text-sm font-bold text-accent-primary shrink-0">
                    {item.authorName.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="font-semibold text-text-primary">{item.authorName}</p>
                  <p className="text-sm text-text-muted">
                    {pickLocale(item.roleJson, locale)}
                  </p>
                </div>
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
