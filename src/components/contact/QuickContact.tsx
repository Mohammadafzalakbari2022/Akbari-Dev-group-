"use client";

import { useTranslations } from "next-intl";
import { Mail, MessageCircle, Phone } from "lucide-react";
import {
  formatEmailUrl,
  formatPhoneUrl,
  formatTelegramUrl,
  formatWhatsAppUrl,
} from "@/lib/social";
import { Button } from "@/components/ui/button";

type QuickContactProps = {
  email?: string;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  variant?: "buttons" | "compact";
};

export function QuickContact({
  email,
  phone,
  whatsapp,
  telegram,
  variant = "buttons",
}: QuickContactProps) {
  const t = useTranslations("contact");

  const items = [
    whatsapp?.trim() && {
      key: "whatsapp",
      href: formatWhatsAppUrl(whatsapp),
      label: t("whatsapp"),
      icon: MessageCircle,
    },
    telegram?.trim() && {
      key: "telegram",
      href: formatTelegramUrl(telegram),
      label: t("telegram"),
      icon: MessageCircle,
    },
    email?.trim() && {
      key: "email",
      href: formatEmailUrl(email),
      label: t("email"),
      icon: Mail,
    },
    phone?.trim() && {
      key: "phone",
      href: formatPhoneUrl(phone),
      label: t("phone"),
      icon: Phone,
    },
  ].filter(Boolean) as {
    key: string;
    href: string;
    label: string;
    icon: typeof Mail;
  }[];

  if (items.length === 0) return null;

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.key}
              href={item.href}
              target={item.key === "email" || item.key === "phone" ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={item.label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted hover:text-accent-primary hover:border-accent-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            >
              <Icon className="h-4 w-4" aria-hidden />
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Button key={item.key} asChild variant="outline" size="sm">
            <a
              href={item.href}
              target={item.key === "email" || item.key === "phone" ? undefined : "_blank"}
              rel="noopener noreferrer"
            >
              <Icon className="h-4 w-4" aria-hidden />
              {item.label}
            </a>
          </Button>
        );
      })}
    </div>
  );
}
