import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiExternalLink, FiGithub } from "react-icons/fi";
import { fetchProject } from "../api/projects";
import { fetchReadme } from "../api/github";
import { FALLBACK_PROJECTS } from "../lib/fallback";
import { getSkillIcon } from "../lib/skillIcons";
import { useTheme } from "../hooks/useTheme";
import { useProfile } from "../hooks/useProfile";
import CaseStudyNav from "../components/CaseStudyNav";
import Footer from "../sections/Footer";
import AnimatedBackground from "../components/AnimatedBackground";
import { getLocalReadmeHtml, getProjectPreviewImage } from "../lib/projectReadmes";
import type { Project } from "../types";

function isWeakReadme(html: string) {
  const t = html.toLowerCase();
  return (
    !html.trim() ||
    t.includes("not synced yet") ||
    t.includes("no readme linked") ||
    t.includes("readme unavailable")
  );
}

export default function ProjectDetail() {
  const { id = "" } = useParams();
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const { profile } = useProfile();
  const seeded = (location.state as { project?: Project } | null)?.project;
  const [project, setProject] = useState<Project | null>(seeded ?? null);
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        let p: Project | undefined = seeded;
        if (!p) {
          try {
            p = await fetchProject(id);
          } catch {
            p = FALLBACK_PROJECTS.find((x) => x.id === id || x.title === id);
          }
        }
        if (!alive) return;
        setProject(p ?? null);

        const localReadme = getLocalReadmeHtml(p?.title);
        const fallbackHtml =
          localReadme ||
          p?.content_html ||
          "<p>Project details coming soon. Add a GitHub URL or Sync Data from Admin.</p>";

        if (localReadme && alive) {
          setHtml(localReadme);
        } else if (p?.github_url) {
          try {
            const readme = await fetchReadme(p.github_url);
            if (!alive) return;
            setHtml(isWeakReadme(readme) ? fallbackHtml : readme);
          } catch {
            if (alive) setHtml(fallbackHtml);
          }
        } else if (alive) {
          setHtml(fallbackHtml);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, seeded]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-500 dark:text-ink-400">
        Loading…
      </div>
    );
  }
  if (!project) {
    return (
      <div className="section pt-28 text-center">
        <p className="text-ink-700 dark:text-linen-200">Project not found.</p>
        <Link to="/#projects" className="btn-primary mt-4 inline-flex">
          Back to projects
        </Link>
      </div>
    );
  }

  const previewImage = getProjectPreviewImage(project.title);

  return (
    <>
      <AnimatedBackground />
      <CaseStudyNav profile={profile} theme={theme} onToggleTheme={toggle} />
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen pb-10 pt-24"
      >
        <div className="section !py-10">
          <Link
            to="/#projects"
            className="mb-8 inline-flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700 dark:text-sage-300 dark:hover:text-sage-200"
          >
            <FiArrowLeft /> Back to projects
          </Link>

          <h1 className="font-heading text-3xl font-semibold tracking-tight text-ink-900 dark:text-linen-50 sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-600 dark:text-ink-400">
            {project.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {project.github_url ? (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <FiGithub /> View Code
              </a>
            ) : null}
            {project.demo_url ? (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                <FiExternalLink /> Live demo
              </a>
            ) : null}
          </div>

          {(project.tech || []).length ? (
            <div className="mt-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400">
                Tech stack
              </p>
              <div className="flex flex-wrap gap-2">
                {(project.tech || []).map((t) => {
                  const { Icon, color } = getSkillIcon(t);
                  return (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 border border-linen-300 bg-linen-50/80 px-3 py-1 text-xs text-ink-700 dark:border-ink-700 dark:bg-studio-duskSoft dark:text-linen-200"
                    >
                      <Icon style={{ color }} size={12} />
                      {t}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : null}

          {previewImage ? (
            <div className="mt-10 overflow-hidden border border-linen-300 dark:border-ink-700">
              <img
                src={previewImage}
                alt={`${project.title} dashboard preview`}
                className="w-full object-cover object-top"
              />
            </div>
          ) : null}

          <div className="mt-12">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-800 dark:text-linen-100">
              <FiGithub className="text-sage-600 dark:text-sage-300" />
              README
            </div>
            <div
              className="readme-body border border-linen-300 bg-linen-50/60 p-6 dark:border-ink-700 dark:bg-studio-duskSoft/60 sm:p-8"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </motion.main>
      <Footer profile={profile} />
    </>
  );
}
