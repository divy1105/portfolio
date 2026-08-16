/** Ordered whitelist — empty = show all */
export const VISIBLE_PROJECTS: string[] = [
  "CrimePulse",
  "CareerLens",
  "TravelMind",
  "Manager_Task_Ai",
  "Event-Management-System-MCA",
  "Sporties",
];

export const PROJECT_THUMBNAILS: Record<string, { src: string; height?: string }> = {
  CrimePulse: { src: "/projects/crimepulse-hero.png" },
  CareerLens: { src: "/projects/careerlens-hero.png" },
  TravelMind: { src: "/projects/travelmind-hero.png" },
  Manager_Task_Ai: { src: "/projects/manager-task-ai-hero.png" },
};

export function filterProjects<T extends { title: string }>(projects: T[]): T[] {
  if (!VISIBLE_PROJECTS.length) return projects;
  const order = new Map(VISIBLE_PROJECTS.map((t, i) => [t.toLowerCase(), i]));
  return projects
    .filter((p) => order.has(p.title.toLowerCase()))
    .sort(
      (a, b) =>
        (order.get(a.title.toLowerCase()) ?? 999) - (order.get(b.title.toLowerCase()) ?? 999),
    );
}
