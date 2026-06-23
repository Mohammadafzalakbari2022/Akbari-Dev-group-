"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AuroraBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="aurora-bg" aria-hidden="true">
      <motion.div
        className="aurora-blob aurora-blob-primary"
        animate={
          reducedMotion
            ? undefined
            : {
                x: [0, 30, -20, 0],
                y: [0, -25, 15, 0],
                scale: [1, 1.1, 0.95, 1],
              }
        }
        transition={
          reducedMotion
            ? undefined
            : { duration: 18, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        className="aurora-blob aurora-blob-secondary"
        animate={
          reducedMotion
            ? undefined
            : {
                x: [0, -35, 25, 0],
                y: [0, 20, -30, 0],
                scale: [1, 0.9, 1.15, 1],
              }
        }
        transition={
          reducedMotion
            ? undefined
            : { duration: 22, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        className="aurora-blob aurora-blob-warm hidden sm:block"
        animate={
          reducedMotion
            ? undefined
            : {
                x: [0, 20, -15, 0],
                y: [0, 15, -10, 0],
              }
        }
        transition={
          reducedMotion
            ? undefined
            : { duration: 16, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <div className="grid-overlay" />
    </div>
  );
}
