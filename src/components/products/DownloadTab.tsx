"use client";

import { QRCodeSVG } from "qrcode.react";
import { Download, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PlatformType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "./PlatformBadge";
import type { ProductPlatformDto } from "@/lib/data/types";

type DownloadTabProps = {
  platforms: ProductPlatformDto[];
  locale: string;
  productSlug: string;
  baseUrl: string;
};

function platformLabel(platform: PlatformType, t: ReturnType<typeof useTranslations>) {
  const labels: Record<PlatformType, string> = {
    android: t("downloadAndroid"),
    ios: t("downloadIos"),
    web: t("openWeb"),
    desktop: t("downloadDesktop"),
    database: t("viewDocs"),
    other: t("download"),
  };
  return labels[platform];
}

export function DownloadTab({ platforms, locale, baseUrl }: DownloadTabProps) {
  const t = useTranslations("products");
  const activePlatforms = platforms.filter((p) => p.isActive && p.downloadUrl);

  if (activePlatforms.length === 0) {
    return (
      <p className="text-text-muted">{t("noDownloads")}</p>
    );
  }

  const androidPlatform = activePlatforms.find((p) => p.platform === "android");
  const qrUrl = androidPlatform
    ? `${baseUrl}/api/download/${androidPlatform.id}?locale=${locale}`
    : null;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {activePlatforms.map((platform) => (
          <div
            key={platform.id}
            className="rounded-xl glass-panel p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <PlatformBadge platform={platform.platform} locale={locale} />
              {platform.version && (
                <span className="text-xs text-text-muted">v{platform.version}</span>
              )}
            </div>
            {platform.fileSize && (
              <p className="text-sm text-text-muted">{platform.fileSize}</p>
            )}
            {platform.minOs && (
              <p className="text-xs text-text-muted">{platform.minOs}</p>
            )}
            <Button asChild className="w-full mt-auto">
              <a
                href={`/api/download/${platform.id}?locale=${locale}`}
                target={platform.platform === "web" ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                {platform.platform === "web" ? (
                  <ExternalLink className="h-4 w-4" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {platformLabel(platform.platform, t)}
              </a>
            </Button>
          </div>
        ))}
      </div>

      {androidPlatform && qrUrl && (
        <div className="rounded-xl glass-panel p-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <QRCodeSVG
            value={qrUrl}
            size={160}
            bgColor="transparent"
            fgColor="currentColor"
            className="text-text-primary shrink-0"
          />
          <div>
            <h4 className="font-semibold text-text-primary">{t("qrTitle")}</h4>
            <p className="mt-2 text-sm text-text-muted">{t("qrHint")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
