import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import type { Profile } from "../types";
import SectionHeading from "../components/SectionHeading";

export default function Experience({ profile }: { profile: Profile }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="experience" className="section scroll-mt-24">
      <SectionHeading eyebrow="Practice" title="Experience" />
      <div className="mx-auto max-w-3xl">
        {profile.experience.map((job, i) => {
          const expanded = openIndex === i;
          const panelId = `experience-panel-${i}`;
          const buttonId = `experience-trigger-${i}`;

          return (
            <motion.div
              key={job.company + job.role}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: i * 0.08 }}
              className="border-b border-linen-300 dark:border-ink-700"
            >
              <button
                type="button"
                id={buttonId}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpenIndex(expanded ? -1 : i)}
                className="flex w-full items-start justify-between gap-4 py-6 text-left transition hover:text-sage-600 dark:hover:text-sage-300"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-heading text-xl font-semibold text-ink-900 dark:text-linen-50">
                      {job.role}
                    </h3>
                    <span className="text-xs font-medium uppercase tracking-wider text-ink-500 dark:text-ink-400">
                      {job.start} – {job.end}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
                    {job.company} · {job.location}
                  </p>
                </div>
                <FiChevronDown
                  className={`mt-1 shrink-0 text-sage-600 transition-transform duration-300 dark:text-sage-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>
              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-2.5 pb-6">
                      {job.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex gap-3 text-sm leading-relaxed text-ink-700 dark:text-linen-200"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sage-500" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
