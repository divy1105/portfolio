import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import type { Profile } from "../types";
import DownloadPdfButton from "./DownloadPdfButton";

const LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({
  profile,
  theme,
  onToggleTheme,
}: {
  profile: Profile;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setActive(id);
    const behavior =
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior });
      window.history.replaceState(null, "", `/#${id}`);
      return;
    }
    navigate(`/#${id}`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActive("");
      return;
    }

    const ids = LINKS.map((l) => l.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActive(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  const linkClass = (id: string, mobile = false) => {
    const isActive = active === id;
    if (mobile) {
      return `rounded-md px-3 py-2.5 text-sm transition ${
        isActive
          ? "bg-sage-100 text-sage-700 dark:bg-ink-800 dark:text-sage-200"
          : "text-ink-700 hover:bg-linen-100 dark:text-linen-200 dark:hover:bg-ink-800"
      }`;
    }
    return `relative px-2.5 py-1 text-sm transition ${
      isActive
        ? "text-sage-600 dark:text-sage-300"
        : "text-ink-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-linen-100"
    }`;
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-5 py-4 transition sm:px-8 lg:px-12 ${
          scrolled
            ? "border-b border-linen-300/70 bg-linen-50/90 backdrop-blur-md dark:border-ink-700/70 dark:bg-studio-dusk/90"
            : "bg-transparent"
        }`}
      >
        <Link
          to="/"
          className="font-heading text-lg font-semibold tracking-tight text-ink-900 dark:text-linen-50"
        >
          {profile.name}
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`/#${l.id}`}
              onClick={go(l.id)}
              className={linkClass(l.id)}
              aria-current={active === l.id ? "true" : undefined}
            >
              {l.label}
              {active === l.id ? (
                <span className="absolute inset-x-2 -bottom-0.5 h-px bg-sage-500" aria-hidden />
              ) : null}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-md border border-linen-300 p-2 text-ink-700 transition hover:border-sage-400 dark:border-ink-700 dark:text-linen-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
          <DownloadPdfButton
            href={profile.resume_drive_url}
            label="Resume"
            source="navbar"
            className="btn-primary hidden !px-3.5 !py-2 text-xs sm:inline-flex"
          />
          <button
            type="button"
            className="rounded-md border border-linen-300 p-2 text-ink-800 lg:hidden dark:border-ink-700 dark:text-linen-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="surface mx-4 rounded-md p-3 shadow-soft lg:hidden"
          >
            <div className="flex flex-col gap-0.5">
              {LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`/#${l.id}`}
                  onClick={go(l.id)}
                  className={linkClass(l.id, true)}
                  aria-current={active === l.id ? "true" : undefined}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
