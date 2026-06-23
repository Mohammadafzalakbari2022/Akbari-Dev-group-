import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { SocialStrip } from "./SocialStrip";
import { QuickContact } from "@/components/contact/QuickContact";
import type { SiteSettings } from "@/lib/data/site-settings";
import { hasAnyPaymentMethod } from "@/lib/data/payments";

const footerLinks = [
  { href: "/about" as const, key: "about" as const },
  { href: "/products" as const, key: "products" as const },
  { href: "/contact" as const, key: "contact" as const },
];

type FooterProps = {
  settings: SiteSettings;
};

export async function Footer({ settings }: FooterProps) {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tBrand = await getTranslations("brand");
  const year = new Date().getFullYear();
  const showPayments = hasAnyPaymentMethod(settings.payments);

  return (
    <footer className="mt-auto border-t border-border bg-bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <p className="text-lg font-semibold text-text-primary">
              {tBrand("name")}
            </p>
            <p className="mt-2 max-w-md text-sm text-text-muted">
              {tBrand("tagline")}
            </p>
            <div className="mt-4">
              <QuickContact
                email={settings.contact.email}
                phone={settings.contact.phone}
                whatsapp={settings.contact.whatsapp}
                telegram={settings.contact.telegram}
                variant="compact"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-text-primary mb-3">
              {tNav("about")}
            </p>
            <ul className="space-y-2 text-sm text-text-muted">
              {footerLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="hover:text-accent-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-accent-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-accent-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded"
                >
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {settings.social.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border">
            <SocialStrip links={settings.social} title={t("followUs")} size="sm" />
          </div>
        )}

        {showPayments && (
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-text-muted">
            <span>{t("payments")}:</span>
            {settings.payments.hesabpay.enabled && (
              <span className="rounded-md border border-border px-2 py-1">HesabPay</span>
            )}
            {settings.payments.atomapay.enabled && (
              <span className="rounded-md border border-border px-2 py-1">ATOMA Pay</span>
            )}
          </div>
        )}

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-text-muted">
          {t("copyright", { year })}
        </div>
      </div>
    </footer>
  );
}
