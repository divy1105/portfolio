import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Profile } from "../types";
import SectionHeading from "../components/SectionHeading";
import { getSkillIcon } from "../lib/skillIcons";

export default function Skills({ profile }: { profile: Profile }) {
  const categories = useMemo(() => Object.keys(profile.skills), [profile.skills]);
  const [active, setActive] = useState<string>(categories[0] ?? "");
  const items = profile.skills[active] ?? [];

  return (
    <section id="skills" className="section scroll-mt-24">
      <SectionHeading eyebrow="Toolkit" title="Skills & tech" />

      <div
        className="mb-8 flex flex-wrap gap-2 border-b border-linen-300 pb-4 dark:border-ink-700"
        role="tablist"
        aria-label="Skill categories"
      >
        {categories.map((category) => {
          const selected = active === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(category)}
              className={`relative px-3 py-2 text-sm font-medium transition ${
                selected
                  ? "text-sage-700 dark:text-sage-200"
                  : "text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-linen-100"
              }`}
            >
              {category}
              {selected ? (
                <span className="absolute inset-x-1 -bottom-[17px] h-0.5 bg-sage-500" aria-hidden />
              ) : null}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          role="tabpanel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-wrap gap-2.5">
            {items.map((name) => {
              const { Icon, color } = getSkillIcon(name);
              return (
                <div
                  key={name}
                  className="neon-edge inline-flex items-center gap-2 rounded-md border border-linen-300 bg-linen-50/80 px-3.5 py-2 text-sm text-ink-800 dark:border-ink-700 dark:bg-studio-duskSoft/80 dark:text-linen-100"
                >
                  <Icon style={{ color }} className="text-lg" aria-hidden />
                  <span>{name}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
