"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";

type StatCounterProps = {
  value: number;
  label: string;
  suffix?: string;
};

export function StatCounter({ value, label, suffix = "+" }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reducedMotion = useReducedMotion();
  const [animated, setAnimated] = useState(0);
  const display = reducedMotion ? (inView ? value : 0) : animated;

  useEffect(() => {
    if (!inView || reducedMotion) return;

    const duration = 1500;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimated(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [inView, value, reducedMotion]);

  return (
    <motion.div
      ref={ref}
      className="rounded-xl glass-panel px-6 py-4 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5 }}
    >
      <p className="text-2xl font-bold text-accent-primary tabular-nums">
        {display}
        {suffix}
      </p>
      <p className="text-sm text-text-muted">{label}</p>
    </motion.div>
  );
}
