"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { pickLocale } from "@/lib/i18n-json";
import type { HeroSettingsDto } from "@/lib/data/types";
import { AuroraBackground } from "./AuroraBackground";
import { OrbitCards } from "./OrbitCards";
import { StatCounter } from "./StatCounter";

type HeroSectionProps = {
  locale: string;
  settings: HeroSettingsDto;
};

export function HeroSection({ locale, settings }: HeroSectionProps) {
  const t = useTranslations("hero");
  const reducedMotion = useReducedMotion();

  const headline =
    pickLocale(settings.headlineJson, locale) || t("headline");
  const subheadline =
    pickLocale(settings.subheadlineJson, locale) || t("subheadline");

  const stats = [
    {
      value: settings.statProducts,
      label: t("statProducts"),
      suffix: "+",
    },
    {
      value: settings.statDownloads,
      label: t("statDownloads"),
      suffix: "+",
    },
    {
      value: 3,
      label: t("statLanguages"),
      suffix: "",
    },
  ];

  return (
    <section className="relative min-h-[calc(100dvh-var(--navbar-height))] flex items-center overflow-hidden">
      <AuroraBackground />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div
            className="flex flex-col gap-6 text-center lg:text-start"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
            <p className="max-w-xl text-lg text-text-muted mx-auto lg:mx-0">
              {subheadline}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="/products">{t("ctaProducts")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">{t("ctaAbout")}</Link>
              </Button>
            </div>
          </motion.div>

          <OrbitCards products={settings.featuredProducts} locale={locale} />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-border pt-8">
          {stats.map((stat) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
