import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import { Download, Star, Package } from "lucide-react";
import { getProductBySlug } from "@/lib/data/products";
import { getSiteSettings } from "@/lib/data/site-settings";
import { pickLocale } from "@/lib/i18n-json";
import { formatDate, formatDownloadCount } from "@/lib/format";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { hasAnyPaymentMethod } from "@/lib/data/payments";
import { ShareButton } from "@/components/products/ShareButton";
import { ProductFeatures } from "@/components/products/ProductFeatures";
import { HowToUseSection } from "@/components/products/HowToUseSection";
import { ProductDetailTabs } from "@/components/products/ProductDetailTabs";
import { PlatformBadge } from "@/components/products/PlatformBadge";
import { SupportPricingBlock } from "@/components/products/SupportPricingBlock";
import { ProductSocialStrip } from "@/components/products/ProductSocialStrip";
import { ReportProblemForm } from "@/components/products/ReportProblemForm";
import { HowToPaySection } from "@/components/payments/HowToPaySection";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not Found" };

  const seo = product.seoJson as {
    title_json?: Record<string, string>;
    description_json?: Record<string, string>;
    og_image?: string;
  } | null;

  const title =
    pickLocale(seo?.title_json, locale) || pickLocale(product.nameJson, locale);
  const description =
    pickLocale(seo?.description_json, locale) ||
    pickLocale(product.taglineJson, locale);

  return buildPageMetadata({
    locale,
    title,
    description,
    path: `/products/${slug}`,
    image: seo?.og_image || product.coverUrl || product.iconUrl || undefined,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });

  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);
  if (!product) notFound();

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${protocol}://${host}`;
  const pageUrl = `${baseUrl}/${locale}/products/${slug}`;

  const name = pickLocale(product.nameJson, locale);
  const tagline = pickLocale(product.taglineJson, locale);
  const purpose = pickLocale(product.purposeJson, locale);
  const requirements = product.requirementsJson as Record<
    string,
    Record<string, string> | string
  > | null;

  const latestVersion = product.platforms[0]?.version;
  const showNew =
    product.isNew &&
    (!product.isNewUntil || product.isNewUntil > new Date());

  const pricing = product.pricingJson as { type?: string } | null;
  const showPayments =
    hasAnyPaymentMethod(settings.payments) ||
    pricing?.type === "fixed" ||
    pricing?.type === "contact";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between pb-10 border-b border-border">
        <div className="flex gap-5">
          {product.iconUrl ? (
            <RemoteImage
              src={product.iconUrl}
              alt=""
              width={80}
              height={80}
              className="rounded-2xl object-cover shrink-0"
              priority
            />
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-accent-primary/15 flex items-center justify-center shrink-0">
              <Package className="h-10 w-10 text-accent-primary" aria-hidden />
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-text-primary">{name}</h1>
              {product.featured && (
                <Badge variant="warm">{t("featured")}</Badge>
              )}
              {showNew && <Badge>{t("new")}</Badge>}
            </div>
            <p className="text-lg text-text-muted">{tagline}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {product.platforms.map((p) => (
                <PlatformBadge
                  key={p.id}
                  platform={p.platform}
                  locale={locale}
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-muted">
              {latestVersion && (
                <span>
                  {t("version")}: v{latestVersion}
                </span>
              )}
              <span>
                {t("lastUpdated")}: {formatDate(product.updatedAt, locale)}
              </span>
              {product.downloadCount > 0 && (
                <span className="flex items-center gap-1">
                  <Download className="h-4 w-4" aria-hidden />
                  {formatDownloadCount(product.downloadCount, locale)}{" "}
                  {t("downloads")}
                </span>
              )}
              {product.reviewCount > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent-warm text-accent-warm" aria-hidden />
                  {product.averageRating} ({product.reviewCount})
                </span>
              )}
            </div>
          </div>
        </div>
        <ShareButton url={pageUrl} title={name} />
      </header>

      {product.coverUrl && (
        <div className="relative mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
          <RemoteImage
            src={product.coverUrl}
            alt=""
            width={1200}
            height={400}
            className="w-full h-48 sm:h-64 object-cover"
            priority
          />
        </div>
      )}

      <div className="space-y-16 py-10">
        {purpose && (
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              {t("purpose")}
            </h2>
            <p className="text-text-muted leading-relaxed max-w-3xl">{purpose}</p>
          </section>
        )}

        <ProductFeatures
          featuresJson={product.featuresJson}
          locale={locale}
          title={t("features")}
        />

        {product.screenshots.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary">
              {t("screenshots")}
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
              {product.screenshots.map((ss) => (
                <figure
                  key={ss.id}
                  className="shrink-0 snap-center rounded-xl overflow-hidden glass-panel"
                >
                  <RemoteImage
                    src={ss.url}
                    alt={pickLocale(ss.captionJson, locale)}
                    width={400}
                    height={320}
                    className="h-64 sm:h-80 w-auto object-cover"
                    sizes="(max-width: 640px) 80vw, 400px"
                  />
                  {pickLocale(ss.captionJson, locale) && (
                    <figcaption className="p-3 text-sm text-text-muted text-center">
                      {pickLocale(ss.captionJson, locale)}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {requirements && Object.keys(requirements).length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">
              {t("requirements")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(requirements).map(([platform, req]) => {
                const text =
                  typeof req === "string"
                    ? req
                    : pickLocale(req, locale);
                return (
                  <div key={platform} className="rounded-xl glass-panel p-5">
                    <PlatformBadge
                      platform={
                        platform as Parameters<
                          typeof PlatformBadge
                        >[0]["platform"]
                      }
                      locale={locale}
                    />
                    <p className="mt-2 text-sm text-text-muted">{text}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <HowToUseSection
          guides={product.guides}
          locale={locale}
          productId={product.id}
        />

        <ProductDetailTabs
          product={product}
          locale={locale}
          baseUrl={baseUrl}
        />

        <SupportPricingBlock
          contactJson={product.contactJson}
          pricingJson={product.pricingJson}
          globalContact={settings.contact}
          locale={locale}
          supportTitle={t("supportTitle")}
          pricingTitle={t("pricingTitle")}
        />

        {showPayments && (
          <HowToPaySection
            payments={settings.payments}
            locale={locale}
            title={t("howToPay")}
          />
        )}

        <ProductSocialStrip
          productSocial={product.socialJson}
          globalSocial={settings.social}
          title={t("followProduct")}
        />

        <ReportProblemForm
          productId={product.id}
          productName={name}
          locale={locale}
        />
      </div>
    </div>
  );
}
