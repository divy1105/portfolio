import { motion } from "framer-motion";
import type { Profile } from "../types";
import SectionHeading from "../components/SectionHeading";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export default function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="section scroll-mt-24">
      <SectionHeading eyebrow="Studio notes" title="About" />
      <div className="grid gap-12 lg:grid-cols-12">
        <motion.div {...fadeUp} className="lg:col-span-7">
          {profile.about.map((p, i) => (
            <motion.p
              key={p.slice(0, 24)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="mt-5 text-lg leading-relaxed text-ink-700 first:mt-0 dark:text-linen-200"
            >
              {p}
            </motion.p>
          ))}
          <dl className="mt-10 grid gap-6 border-t border-linen-300 pt-8 sm:grid-cols-3 dark:border-ink-700">
            {profile.facts.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.07 }}
              >
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-600 dark:text-sage-300">
                  {f.label}
                </dt>
                <dd className="mt-2 font-heading text-lg font-medium text-ink-900 dark:text-linen-50">
                  {f.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="space-y-10 lg:col-span-5"
        >
          <div>
            <h3 className="font-heading text-xl font-semibold text-ink-900 dark:text-linen-50">
              Education
            </h3>
            <ul className="mt-5 space-y-5">
              {profile.education.map((e) => (
                <li key={e.degree} className="border-l-2 border-sage-400 pl-4">
                  <div className="font-medium text-ink-900 dark:text-linen-50">
                    {e.degree}
                  </div>
                  <div className="mt-0.5 text-sm text-ink-600 dark:text-ink-400">
                    {e.institution}
                  </div>
                  <div className="mt-1 text-xs text-sage-600 dark:text-sage-300">
                    {e.start} – {e.end} · {e.score}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-xl font-semibold text-ink-900 dark:text-linen-50">
              Achievements
            </h3>
            <ul className="mt-5 space-y-2.5">
              {profile.achievements.map((a) => (
                <li
                  key={a}
                  className="flex gap-3 text-sm leading-relaxed text-ink-700 dark:text-linen-200"
                >
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sage-500"
                    aria-hidden
                  />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
