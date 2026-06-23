"use client";

import {
  ClipboardList,
  Ruler,
  Bell,
  Fuel,
  BarChart3,
  Globe,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { pickLocale } from "@/lib/i18n-json";

const iconMap: Record<string, LucideIcon> = {
  "clipboard-list": ClipboardList,
  ruler: Ruler,
  bell: Bell,
  fuel: Fuel,
  "bar-chart": BarChart3,
  globe: Globe,
  sparkles: Sparkles,
};

type ProductFeaturesProps = {
  featuresJson: unknown;
  locale: string;
  title: string;
};

export function ProductFeatures({
  featuresJson,
  locale,
  title,
}: ProductFeaturesProps) {
  if (!Array.isArray(featuresJson) || featuresJson.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuresJson.map((item, i) => {
          const feature = item as {
            icon?: string;
            title_json?: unknown;
            description_json?: unknown;
          };
          const Icon = iconMap[feature.icon ?? ""] ?? Sparkles;
          return (
            <div key={i} className="rounded-xl glass-panel p-5">
              <Icon className="h-8 w-8 text-accent-primary mb-3" />
              <h3 className="font-semibold text-text-primary">
                {pickLocale(feature.title_json, locale)}
              </h3>
              <p className="mt-2 text-sm text-text-muted">
                {pickLocale(feature.description_json, locale)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
