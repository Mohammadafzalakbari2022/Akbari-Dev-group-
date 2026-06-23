import { pickLocale } from "@/lib/i18n-json";
import type { SiteSettings } from "@/lib/data/site-settings";

type Props = {
  settings: SiteSettings;
  locale: string;
};

export function MaintenanceScreen({ settings, locale }: Props) {
  const message = pickLocale(settings.maintenance.message, locale);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-lg text-center space-y-4">
        <h1 className="text-2xl font-bold text-text-primary">
          {message || "Site under maintenance"}
        </h1>
        {(settings.contact.whatsapp || settings.contact.email) && (
          <p className="text-text-muted text-sm">
            {settings.contact.whatsapp && (
              <a
                href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g, "")}`}
                className="text-accent-primary hover:underline"
              >
                WhatsApp
              </a>
            )}
            {settings.contact.whatsapp && settings.contact.email && " · "}
            {settings.contact.email && (
              <a
                href={`mailto:${settings.contact.email}`}
                className="text-accent-primary hover:underline"
              >
                {settings.contact.email}
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
