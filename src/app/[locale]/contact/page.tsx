import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSiteSettings } from "@/lib/data/site-settings";
import { hasAnyPaymentMethod } from "@/lib/data/payments";
import { ContactForm } from "@/components/contact/ContactForm";
import { QuickContact } from "@/components/contact/QuickContact";
import { HowToPaySection } from "@/components/payments/HowToPaySection";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.contact" });

  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    path: "/contact",
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  const tPay = await getTranslations({ locale, namespace: "home" });
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-text-muted">{t("description")}</p>
        </div>

        <div className="mb-8">
          <QuickContact
            email={settings.contact.email}
            phone={settings.contact.phone}
            whatsapp={settings.contact.whatsapp}
            telegram={settings.contact.telegram}
          />
        </div>

        <ContactForm locale={locale} />

        {hasAnyPaymentMethod(settings.payments) && (
          <div className="mt-16">
            <HowToPaySection
              payments={settings.payments}
              locale={locale}
              title={tPay("howToPay")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
