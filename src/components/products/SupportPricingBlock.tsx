import { pickLocale } from "@/lib/i18n-json";
import { QuickContact } from "@/components/contact/QuickContact";
import type { SiteSettings } from "@/lib/data/site-settings";

type ProductContactJson = {
  supportMessage?: Record<string, string>;
  pricingMessage?: Record<string, string>;
  whatsapp?: string;
  telegram?: string;
  email?: string;
  phone?: string;
};

type PricingJson = {
  type?: "free" | "contact" | "fixed";
  label_json?: Record<string, string>;
  amount?: string;
};

type SupportPricingBlockProps = {
  contactJson: unknown;
  pricingJson: unknown;
  globalContact: SiteSettings["contact"];
  locale: string;
  supportTitle: string;
  pricingTitle: string;
};

function hasText(value: Record<string, string> | undefined): boolean {
  if (!value) return false;
  return Object.values(value).some((v) => v?.trim());
}

export function SupportPricingBlock({
  contactJson,
  pricingJson,
  globalContact,
  locale,
  supportTitle,
  pricingTitle,
}: SupportPricingBlockProps) {
  const contact = (contactJson ?? {}) as ProductContactJson;
  const pricing = (pricingJson ?? {}) as PricingJson;

  const supportMessage = hasText(contact.supportMessage)
    ? pickLocale(contact.supportMessage, locale)
    : pickLocale(globalContact.supportMessage, locale);

  const pricingMessage = hasText(contact.pricingMessage)
    ? pickLocale(contact.pricingMessage, locale)
    : pickLocale(globalContact.pricingMessage, locale);

  const pricingLabel = pricing.label_json
    ? pickLocale(pricing.label_json, locale)
    : "";

  const whatsapp = contact.whatsapp?.trim() || globalContact.whatsapp;
  const telegram = contact.telegram?.trim() || globalContact.telegram;
  const email = contact.email?.trim() || globalContact.email;
  const phone = contact.phone?.trim() || globalContact.phone;

  const hasSupport = Boolean(supportMessage);
  const hasPricing = Boolean(pricingMessage || pricingLabel);
  const hasContact = Boolean(whatsapp || telegram || email || phone);

  if (!hasSupport && !hasPricing && !hasContact) return null;

  return (
    <section
      className="rounded-xl glass-panel p-8 space-y-8"
      aria-labelledby="support-pricing-heading"
    >
      <h2
        id="support-pricing-heading"
        className="text-2xl font-bold text-text-primary"
      >
        {supportTitle}
      </h2>

      {hasSupport && (
        <div>
          <h3 className="text-sm font-medium text-accent-primary mb-2">
            {supportTitle}
          </h3>
          <p className="text-text-muted leading-relaxed">{supportMessage}</p>
        </div>
      )}

      {hasPricing && (
        <div>
          <h3 className="text-sm font-medium text-accent-warm mb-2">
            {pricingTitle}
          </h3>
          {pricingLabel && (
            <p className="text-lg font-semibold text-text-primary mb-2">
              {pricingLabel}
            </p>
          )}
          {pricingMessage && (
            <p className="text-text-muted leading-relaxed">{pricingMessage}</p>
          )}
        </div>
      )}

      {hasContact && (
        <QuickContact
          email={email}
          phone={phone}
          whatsapp={whatsapp}
          telegram={telegram}
        />
      )}
    </section>
  );
}
