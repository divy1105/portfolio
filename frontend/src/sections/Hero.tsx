import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import type { Profile } from "../types";
import DownloadPdfButton from "../components/DownloadPdfButton";
import SocialLinks from "../components/SocialLinks";
import HeroAtmosphere from "../components/HeroAtmosphere";

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length <= 1) return { first: full, last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export default function Hero({ profile }: { profile: Profile }) {
  const ref = useRef<HTMLElement>(null);
  const { first, last } = useMemo(() => splitName(profile.name), [profile.name]);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 pt-28 sm:justify-center sm:pb-20 sm:pt-28"
    >
      <HeroAtmosphere />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="section-wide relative z-10 w-full"
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-sage-700 dark:text-sage-300"
        >
          {profile.status}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[16ch] font-heading text-[clamp(3.25rem,11vw,7.25rem)] font-semibold leading-[0.94] tracking-tight"
        >
          <span className="text-ink-900 dark:text-linen-50">{first}</span>
          {last ? (
            <>
              {" "}
              <span className="hero-name-accent italic font-semibold text-[#B85C45] transition-colors duration-300 hover:text-[#C4A35A] dark:text-[#D4B07A] dark:hover:text-[#E8C99A]">
                {last}
              </span>
            </>
          ) : null}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-7 max-w-xl font-heading text-xl font-medium leading-snug text-ink-800 dark:text-linen-100 sm:text-2xl md:text-[1.65rem]"
        >
          {profile.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 max-w-md text-base leading-relaxed text-ink-700 dark:text-linen-200/90"
        >
          {profile.title} · {profile.location}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a href="#projects" className="btn-primary">
            View selected work
          </a>
          <a href="#contact" className="btn-ghost">
            Get in touch
          </a>
          <DownloadPdfButton href={profile.resume_drive_url} source="hero" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10"
        >
          <SocialLinks socials={profile.socials} />
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-500 transition hover:text-sage-600 sm:flex dark:text-ink-400 dark:hover:text-sage-300"
        aria-label="Scroll to about"
      >
        Scroll
        <span
          className="block h-8 w-px origin-top bg-sage-500/70 dark:bg-sage-300/60 motion-safe:animate-[hero-scroll-line_2.4s_ease-in-out_infinite]"
          aria-hidden
        />
      </motion.a>
    </section>
  );
}
