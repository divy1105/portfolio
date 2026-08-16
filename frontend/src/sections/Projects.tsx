import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUpRight, FiExternalLink, FiGithub, FiSearch } from "react-icons/fi";
import { fetchProjects } from "../api/projects";
import { FALLBACK_PROJECTS } from "../lib/fallback";
import { filterProjects, PROJECT_THUMBNAILS } from "../lib/projectConfig";
import { getProjectPreviewImage } from "../lib/projectReadmes";
import { getSkillIcon } from "../lib/skillIcons";
import type { Project } from "../types";
import SectionHeading from "../components/SectionHeading";
import StatCounter from "../components/StatCounter";
import ProjectMediaTilt from "../components/ProjectMediaTilt";

type FilterKey = "all" | "featured" | string;

function ProjectSkeleton() {
  return (
    <div className="grid gap-6 border-b border-linen-300 py-10 dark:border-ink-700 lg:grid-cols-12">
      <div className="aspect-[16/10] shimmer lg:col-span-7" />
      <div className="space-y-4 lg:col-span-5 lg:self-center">
        <div className="h-8 w-2/3 shimmer" />
        <div className="h-4 w-full shimmer" />
        <div className="h-4 w-4/5 shimmer" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 shimmer" />
          <div className="h-6 w-14 shimmer" />
        </div>
      </div>
    </div>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const navigate = useNavigate();
  const tech = (project.tech || []).slice(0, 5);
  const thumb =
    project.thumbnail ||
    PROJECT_THUMBNAILS[project.title]?.src ||
    getProjectPreviewImage(project.title);
  const flip = index % 2 === 1;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className={`group grid cursor-pointer gap-6 border-b border-linen-300 py-10 dark:border-ink-700 lg:grid-cols-12 lg:gap-10 ${
        flip ? "lg:[&>*:first-child]:order-2" : ""
      }`}
      onClick={() =>
        navigate(`/projects/${encodeURIComponent(project.id)}`, { state: { project } })
      }
    >
      <div className="neon-card aspect-[16/10] bg-linen-200 dark:bg-ink-800 lg:col-span-7">
        <div className="neon-card-inner">
          <ProjectMediaTilt className="relative h-full w-full bg-linen-200 dark:bg-ink-800">
            {thumb ? (
              <img
                src={thumb}
                alt={`${project.title} preview`}
                className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full min-h-[12rem] items-center justify-center bg-gradient-to-br from-sage-100 to-linen-200 dark:from-ink-800 dark:to-studio-duskSoft">
                <span className="font-heading text-4xl text-sage-400/70">
                  {(project.title || "?").slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </ProjectMediaTilt>
        </div>
      </div>

      <div className="flex flex-col justify-center lg:col-span-5">
        <div className="flex flex-wrap items-baseline gap-3">
          <h3 className="font-heading text-2xl font-semibold text-ink-900 transition group-hover:text-sage-600 dark:text-linen-50 dark:group-hover:text-sage-300 sm:text-3xl">
            {project.title}
          </h3>
          {project.featured ? (
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-600 dark:text-sage-300">
              Featured
            </span>
          ) : null}
        </div>
        <p className="mt-3 text-base leading-relaxed text-ink-600 dark:text-ink-400">
          {project.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {tech.map((t) => {
            const { Icon, color } = getSkillIcon(t);
            return (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 border border-linen-300 bg-linen-50/70 px-2.5 py-1 text-xs text-ink-700 dark:border-ink-700 dark:bg-studio-duskSoft dark:text-linen-200"
              >
                <Icon style={{ color }} size={12} />
                {t}
              </span>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            to={`/projects/${encodeURIComponent(project.id)}`}
            state={{ project }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage-600 dark:text-sage-300"
            onClick={(e) => e.stopPropagation()}
          >
            Case study <FiArrowUpRight />
          </Link>
          {project.demo_url ? (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-sm text-ink-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-linen-100"
            >
              <FiExternalLink size={14} /> Live
            </a>
          ) : null}
          {project.github_url ? (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-sm text-ink-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-linen-100"
            >
              <FiGithub size={14} /> Code
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchProjects()
      .then((list) => {
        if (!alive) return;
        setProjects(list.length ? list : FALLBACK_PROJECTS);
      })
      .catch(() => {
        if (!alive) return;
        setError(true);
        setProjects(FALLBACK_PROJECTS);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const base = useMemo(() => filterProjects(projects), [projects]);

  const techOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of base) {
      for (const t of p.tech || []) {
        counts.set(t, (counts.get(t) || 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 8)
      .map(([name]) => name);
  }, [base]);

  const chips: { key: FilterKey; label: string }[] = useMemo(
    () => [
      { key: "all", label: "All" },
      { key: "featured", label: "Featured" },
      ...techOptions.map((t) => ({ key: t, label: t })),
    ],
    [techOptions],
  );

  const visible = useMemo(() => {
    let list = base;
    if (filter === "featured") {
      list = list.filter((p) => p.featured);
    } else if (filter !== "all") {
      list = list.filter((p) =>
        (p.tech || []).some((t) => t.toLowerCase() === filter.toLowerCase()),
      );
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    return list;
  }, [base, filter, query]);

  return (
    <section id="projects" className="section-wide scroll-mt-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Selected work" title="Projects" className="mb-0" />
        <StatCounter value={visible.length} label="Showing" />
      </div>

      <div className="mb-4 flex flex-col gap-4 border-b border-linen-300 pb-6 dark:border-ink-700 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => {
            const active = filter === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => setFilter(chip.key)}
                className={`chip ${active ? "chip-active" : "neon-edge"}`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
        <label className="relative block w-full sm:max-w-xs">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title…"
            className="input-field !rounded-md py-2.5 pl-9 pr-4 text-sm"
            aria-label="Search projects by title"
          />
        </label>
      </div>

      {error ? (
        <p className="mb-4 text-sm text-ink-500 dark:text-ink-400">
          API offline — showing bundled projects. Start the backend to load live cache.
        </p>
      ) : null}

      {loading ? (
        <div>
          {Array.from({ length: 3 }).map((_, i) => (
            <ProjectSkeleton key={i} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="border border-linen-300 px-6 py-12 text-center text-sm text-ink-500 dark:border-ink-700 dark:text-ink-400">
          No projects match this filter. Try another chip or clear search.
        </p>
      ) : (
        <motion.div layout>
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProjectRow key={p.id} project={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
