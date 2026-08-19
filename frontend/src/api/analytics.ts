import { api } from "./client";

const SESSION_KEY = "portfolio_session_id";

export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export async function trackEvent(event_type: "page_view" | "resume_download", extra: Record<string, string> = {}) {
  try {
    await api.post("/api/analytics/event/", {
      event_type,
      session_id: getSessionId(),
      path: window.location.pathname + window.location.hash,
      ...extra,
    });
  } catch {
    /* ignore */
  }
}

export async function sendContact(body: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const { data } = await api.post("/api/contact/", body);
  return data as { success: boolean; id?: string; emailed: boolean };
}

export async function analyticsSummary() {
  const { data } = await api.get("/api/analytics/summary");
  return data;
}

export async function analyticsReport(period = "weekly") {
  const { data } = await api.get("/api/analytics/report", { params: { period } });
  return data;
}