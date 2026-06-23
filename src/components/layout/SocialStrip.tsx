"use client";

import { useTranslations } from "next-intl";
import {
  filterSocialLinks,
  getSocialIcon,
  normalizeSocialUrl,
  type SocialLink,
} from "@/lib/social";
import { cn } from "@/lib/utils";

type SocialStripProps = {
  links: SocialLink[];
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  title?: string;
};

const sizeClasses = {
  sm: "h-8 w-8 text-base",
  md: "h-10 w-10 text-lg",
  lg: "h-12 w-12 text-xl",
};

export function SocialStrip({
  links,
  className,
  size = "md",
  showLabels = false,
  title,
}: SocialStripProps) {
  const t = useTranslations("social");
  const filtered = filterSocialLinks(links);
  if (filtered.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <p className="text-sm font-medium text-text-primary">{title}</p>
      )}
      <div
        className="flex flex-wrap gap-2"
        role="list"
        aria-label={t("followUs")}
      >
        {filtered.map((link) => {
          const Icon = getSocialIcon(link.platform);
          const href = normalizeSocialUrl(link.platform, link.url);
          const label = link.platform;

          return (
            <a
              key={`${link.platform}-${link.url}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              role="listitem"
              aria-label={`${label} (${t("externalLink")})`}
              className={cn(
                "inline-flex items-center justify-center rounded-lg border border-border bg-bg-glass text-text-muted transition-colors",
                "hover:border-accent-primary/40 hover:text-accent-primary hover:bg-accent-primary/10",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep",
                sizeClasses[size],
                showLabels && "w-auto px-3 gap-2",
              )}
            >
              <Icon aria-hidden />
              {showLabels && (
                <span className="text-sm capitalize">{label}</span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
