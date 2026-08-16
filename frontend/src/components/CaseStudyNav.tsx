import { Link } from "react-router-dom";
import { FiArrowLeft, FiMoon, FiSun } from "react-icons/fi";
import type { Profile } from "../types";
import DownloadPdfButton from "./DownloadPdfButton";

/**
 * Subpage header for case studies — studio zone links, not old scroll sections.
 */
export default function CaseStudyNav({
  profile,
  theme,
  onToggleTheme,
}: {
  profile: Profile;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 border-b border-linen-300/70 bg-linen-50/90 px-5 py-4 backdrop-blur-md sm:px-8 lg:px-12 dark:border-ink-700/70 dark:bg-studio-dusk/90">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            to="/"
            className="font-heading text-lg font-semibold tracking-tight text-ink-900 dark:text-linen-50"
          >
            {profile.name}
          </Link>
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Studio">
            <Link
              to="/#projects"
              className="px-2.5 py-1 text-sm text-ink-600 transition hover:text-ink-900 dark:text-ink-400 dark:hover:text-linen-100"
            >
              Projects
            </Link>
            <Link
              to="/#contact"
              className="px-2.5 py-1 text-sm text-ink-600 transition hover:text-ink-900 dark:text-ink-400 dark:hover:text-linen-100"
            >
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-1.5 rounded-md border border-linen-300 px-3 py-2 text-xs font-medium text-ink-700 transition hover:border-sage-400 dark:border-ink-700 dark:text-linen-200"
          >
            <FiArrowLeft />
            <span className="hidden sm:inline">Back to studio</span>
            <span className="sm:hidden">Studio</span>
          </Link>
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
        </div>
      </div>
    </header>
  );
}
