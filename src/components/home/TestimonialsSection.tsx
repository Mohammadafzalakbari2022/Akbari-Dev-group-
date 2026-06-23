"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { pickLocale } from "@/lib/i18n-json";
import type { TestimonialDto } from "@/lib/data/testimonials";
import { RemoteImage } from "@/components/ui/RemoteImage";

type TestimonialsSectionProps = {
  testimonials: TestimonialDto[];
  locale: string;
};

export function TestimonialsSection({
  testimonials,
  locale,
}: TestimonialsSectionProps) {
  const t = useTranslations("home");
  const reducedMotion = useReducedMotion();

  if (testimonials.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="testimonials-heading"
    >
      <h2
        id="testimonials-heading"
        className="text-2xl font-bold text-text-primary mb-8 text-center"
      >
        {t("testimonials")}
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, i) => (
          <motion.blockquote
            key={item.id}
            className="rounded-xl glass-panel p-6 flex flex-col"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <p className="text-text-muted leading-relaxed flex-1">
              &ldquo;{pickLocale(item.quoteJson, locale)}&rdquo;
            </p>
            <footer className="mt-6 flex items-center gap-3">
              {item.avatarUrl ? (
                <RemoteImage
                  src={item.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-accent-primary/15 flex items-center justify-center text-sm font-semibold text-accent-primary">
                  {item.authorName.charAt(0)}
                </div>
              )}
              <div>
                <cite className="not-italic font-medium text-text-primary text-sm">
                  {item.authorName}
                </cite>
                {pickLocale(item.roleJson, locale) && (
                  <p className="text-xs text-text-muted">
                    {pickLocale(item.roleJson, locale)}
                  </p>
                )}
              </div>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}
