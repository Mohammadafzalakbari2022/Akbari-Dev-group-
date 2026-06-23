import type { PlatformType } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const platformLabels: Record<PlatformType, { fa: string; ps: string; en: string }> = {
  android: { fa: "اندروید", ps: "اندروید", en: "Android" },
  ios: { fa: "iOS", ps: "iOS", en: "iOS" },
  web: { fa: "وب", ps: "ویب", en: "Web" },
  desktop: { fa: "دسکتاپ", ps: "ډیسټاپ", en: "Desktop" },
  database: { fa: "پایگاه داده", ps: "ډیټابیس", en: "Database" },
  other: { fa: "سایر", ps: "نور", en: "Other" },
};

type PlatformBadgeProps = {
  platform: PlatformType;
  locale: string;
  className?: string;
};

export function PlatformBadge({ platform, locale, className }: PlatformBadgeProps) {
  const label =
    platformLabels[platform][locale as keyof (typeof platformLabels)["android"]] ??
    platformLabels[platform].en;

  return (
    <Badge variant="secondary" className={cn("text-[10px]", className)}>
      {label}
    </Badge>
  );
}

export { platformLabels };
