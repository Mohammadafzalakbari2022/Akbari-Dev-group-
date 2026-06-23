"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/lib/i18n-json";
import type { ProductListItem } from "@/lib/data/types";

type OrbitCardsProps = {
  products: ProductListItem[];
  locale: string;
};

export function OrbitCards({ products, locale }: OrbitCardsProps) {
  const reducedMotion = useReducedMotion();
  const cards = products.slice(0, 5);

  if (cards.length === 0) return null;

  const radius = 120;

  return (
    <div className="relative hidden sm:flex items-center justify-center min-h-[280px] lg:min-h-[360px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-24 w-24 rounded-2xl glass-panel flex items-center justify-center text-2xl font-bold text-accent-primary shadow-lg shadow-accent-primary/10"
          animate={reducedMotion ? undefined : { scale: [1, 1.05, 1] }}
          transition={
            reducedMotion
              ? undefined
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          A
        </motion.div>
      </div>

      {cards.map((product, i) => {
        const angle = (360 / cards.length) * i;
        const name = pickLocale(product.nameJson, locale);

        const card = (
          <Link
            href={`/products/${product.slug}`}
            className="block h-20 w-36 rounded-xl glass-panel px-3 py-2 flex flex-col items-center justify-center text-center hover:border-accent-primary/40 hover:shadow-lg hover:shadow-accent-primary/5 transition-all"
          >
            <span className="text-sm font-semibold text-text-primary line-clamp-1">
              {name}
            </span>
            <span className="text-[10px] text-text-muted line-clamp-1 mt-1">
              {pickLocale(product.taglineJson, locale)}
            </span>
          </Link>
        );

        if (reducedMotion) {
          const rad = (angle * Math.PI) / 180;
          return (
            <div
              key={product.id}
              className="absolute"
              style={{
                transform: `translate(${Math.sin(rad) * radius}px, ${-Math.cos(rad) * radius}px)`,
              }}
            >
              {card}
            </div>
          );
        }

        return (
          <motion.div
            key={product.id}
            className="absolute flex items-center justify-center"
            style={{ width: 0, height: 0 }}
            animate={{ rotate: [angle, angle + 360] }}
            transition={{
              rotate: {
                duration: 40 + i * 5,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            <motion.div
              style={{ x: radius }}
              animate={{ rotate: [-angle, -(angle + 360)] }}
              transition={{
                rotate: {
                  duration: 40 + i * 5,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            >
              {card}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
