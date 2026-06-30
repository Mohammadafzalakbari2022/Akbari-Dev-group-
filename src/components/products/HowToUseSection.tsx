"use client";

import { useTranslations } from "next-intl";
import { pickLocale } from "@/lib/i18n-json";
import type { ProductGuideDto } from "@/lib/data/types";

type HowToUseSectionProps = {
  guides: ProductGuideDto[];
  locale: string;
  productId: string;
};

async function trackGuideView(
  productId: string,
  guideId: string,
  eventType: string,
  locale: string,
) {
  try {
    await fetch("/api/analytics/guide-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, guideId, eventType, locale }),
    });
  } catch {
    /* analytics stub */
  }
}

export function HowToUseSection({
  guides,
  locale,
  productId,
}: HowToUseSectionProps) {
  const t = useTranslations("products");

  if (guides.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">{t("howToUse")}</h2>
      <div className="space-y-6">
        {guides.map((guide) => {
          const title = pickLocale(guide.titleJson, locale);
          const content = guide.contentJson as Record<string, unknown>;

          if (guide.type === "video" && content?.embedUrl) {
            return (
              <div key={guide.id} className="rounded-xl glass-panel p-4">
                <h3 className="font-semibold mb-3">{title}</h3>
                <div className="aspect-video rounded-lg overflow-hidden bg-bg-surface">
                  <iframe
                    src={String(content.embedUrl)}
                    title={title}
                    className="w-full h-full"
                    allowFullScreen
                    onLoad={() =>
                      trackGuideView(productId, guide.id, "video_play", locale)
                    }
                  />
                </div>
              </div>
            );
          }

          if (guide.type === "steps") {
            const steps = (content?.[locale] ?? content?.fa ?? []) as string[];
            return (
              <div key={guide.id} className="rounded-xl glass-panel p-6">
                <h3 className="font-semibold mb-4">{title}</h3>
                <ol className="space-y-3">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-text-muted">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-primary/15 text-sm font-semibold text-accent-primary">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            );
          }

          if (guide.type === "faq") {
            const faqs = (content?.[locale] ?? content?.fa ?? []) as {
              q: string;
              a: string;
            }[];
            return (
              <div key={guide.id} className="rounded-xl glass-panel p-6">
                <h3 className="font-semibold mb-4">{title}</h3>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <details key={i} className="group rounded-lg border border-border p-4">
                      <summary className="cursor-pointer font-medium text-text-primary list-none flex justify-between">
                        {faq.q}
                      </summary>
                      <p className="mt-2 text-sm text-text-muted">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            );
          }

          if (guide.type === "external_link" && guide.externalUrl) {
            return (
              <div key={guide.id} className="rounded-xl glass-panel p-6">
                <h3 className="font-semibold mb-2">{title}</h3>
                <a
                  href={guide.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:underline"
                  onClick={() =>
                    trackGuideView(
                      productId,
                      guide.id,
                      "external_click",
                      locale,
                    )
                  }
                >
                  {t("openDocumentation")}
                </a>
              </div>
            );
          }

          if (guide.type === "pdf" && guide.fileUrl) {
            return (
              <div key={guide.id} className="rounded-xl glass-panel p-6">
                <h3 className="font-semibold mb-2">{title}</h3>
                <a
                  href={guide.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:underline"
                  onClick={() =>
                    trackGuideView(productId, guide.id, "pdf_open", locale)
                  }
                >
                  {t("downloadGuide")}
                </a>
              </div>
            );
          }

          return null;
        })}
      </div>
    </section>
  );
}
