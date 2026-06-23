import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFeaturedProducts } from "@/lib/data/products";
import { getPublishedTestimonials } from "@/lib/data/testimonials";
import { getSiteSettings } from "@/lib/data/site-settings";
import { hasAnyPaymentMethod } from "@/lib/data/payments";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { SocialStrip } from "@/components/layout/SocialStrip";
import { QuickContact } from "@/components/contact/QuickContact";
import { HowToPaySection } from "@/components/payments/HowToPaySection";
import { Button } from "@/components/ui/button";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";

type HomeSectionsProps = {
  locale: string;
};

export async function HomeSections({ locale }: HomeSectionsProps) {
  const t = await getTranslations({ locale, namespace: "home" });
  const [featured, testimonials, settings] = await Promise.all([
    getFeaturedProducts(),
    getPublishedTestimonials(),
    getSiteSettings(),
  ]);

  const hasSocial = settings.social.some((s) => s.url?.trim());
  const hasContact = Boolean(
    settings.contact.email ||
      settings.contact.phone ||
      settings.contact.whatsapp ||
      settings.contact.telegram,
  );
  const showPayments = hasAnyPaymentMethod(settings.payments);

  return (
    <>
      <OrganizationJsonLd locale={locale} settings={settings} />

      {featured.length > 0 && (
        <section
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
          aria-labelledby="featured-products-heading"
        >
          <div className="flex items-center justify-between gap-4 mb-8">
            <h2
              id="featured-products-heading"
              className="text-2xl font-bold text-text-primary"
            >
              {t("featuredProducts")}
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/products">{t("viewAll")}</Link>
            </Button>
          </div>
          <ProductsGrid products={featured} locale={locale} />
        </section>
      )}

      <TestimonialsSection testimonials={testimonials} locale={locale} />

      {hasSocial && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <SocialStrip
            links={settings.social}
            title={t("followUs")}
            showLabels
          />
        </section>
      )}

      {showPayments && (
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <HowToPaySection
            payments={settings.payments}
            locale={locale}
            title={t("howToPay")}
          />
        </div>
      )}

      {hasContact && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-xl glass-panel p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">
              {t("contactCta")}
            </h2>
            <p className="text-text-muted max-w-lg mx-auto">{t("contactHint")}</p>
            <div className="flex justify-center">
              <QuickContact
                email={settings.contact.email}
                phone={settings.contact.phone}
                whatsapp={settings.contact.whatsapp}
                telegram={settings.contact.telegram}
              />
            </div>
            <Button asChild variant="outline" className="mt-2">
              <Link href="/contact">{t("contactPage")}</Link>
            </Button>
          </div>
        </section>
      )}
    </>
  );
}
