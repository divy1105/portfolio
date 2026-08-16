import { CRIMEPULSE_README_HTML, TRAVELMIND_README_HTML } from "./markdown";

/** Bundled README HTML when GitHub sync has not run, or the repo is private. */
const LOCAL_READMES: Record<string, string> = {
  crimepulse: CRIMEPULSE_README_HTML,
  travelmind: TRAVELMIND_README_HTML,
};

export function getLocalReadmeHtml(title: string | undefined): string | null {
  if (!title) return null;
  return LOCAL_READMES[title.trim().toLowerCase()] ?? null;
}

export const PROJECT_PREVIEW_IMAGES: Record<string, string> = {
  crimepulse: "/projects/crimepulse-hero.png",
  careerlens: "/projects/careerlens-hero.png",
  travelmind: "/projects/travelmind-hero.png",
  manager_task_ai: "/projects/manager-task-ai-hero.png",
};

export function getProjectPreviewImage(title: string | undefined): string | null {
  if (!title) return null;
  return PROJECT_PREVIEW_IMAGES[title.trim().toLowerCase()] ?? null;
}
