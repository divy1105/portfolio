import { motion } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
  className = "mb-12",
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${className} ${align === "center" ? "text-center" : ""}`}
    >
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-ink-900 dark:text-linen-50 sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      <div
        className={`mt-4 h-px w-16 bg-sage-500 ${align === "center" ? "mx-auto" : ""}`}
        aria-hidden
      />
    </motion.div>
  );
}
