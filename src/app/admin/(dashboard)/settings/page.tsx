import { getSiteSettings } from "@/lib/data/site-settings";
import { SettingsEditor } from "@/components/admin/SettingsEditor";
import type { SiteSettingsForm } from "@/lib/admin/actions";
import { emptyLocale } from "@/lib/admin/types";
import { DEFAULT_PAYMENT_SETTINGS } from "@/lib/data/payments";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  const initial: SiteSettingsForm = {
    logo: settings.logo,
    favicon: settings.favicon,
    email: settings.contact.email,
    phone: settings.contact.phone,
    whatsapp: settings.contact.whatsapp,
    telegram: settings.contact.telegram,
    social: settings.social,
    payments: settings.payments ?? DEFAULT_PAYMENT_SETTINGS,
    maintenance_enabled: settings.maintenance.enabled,
    maintenance_message: {
      fa: settings.maintenance.message.fa ?? "",
      ps: settings.maintenance.message.ps ?? "",
      en: settings.maintenance.message.en ?? "",
    },
  };

  if (
    !initial.maintenance_message.fa &&
    !initial.maintenance_message.en
  ) {
    initial.maintenance_message = emptyLocale();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Site Settings</h1>
        <p className="text-text-muted mt-1">
          Logo, contact info, social links, payments, and maintenance mode.
        </p>
      </div>
      <SettingsEditor initial={initial} />
    </div>
  );
}
