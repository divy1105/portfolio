import { motion, useReducedMotion } from "framer-motion";

/** Quiet site-wide wash — hero owns the main atmosphere */
export default function AnimatedBackground() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="studio-wash absolute inset-0" />
      <div className="contents dark:hidden">
        {reduced ? (
          <div className="absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-sage-300/15 blur-3xl" />
        ) : (
          <motion.div
            className="absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-sage-300/15 blur-3xl"
            animate={{ x: [0, -12, 0], y: [0, 14, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </div>
  );
}
