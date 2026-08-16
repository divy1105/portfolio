import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";
import * as authApi from "../api/auth";
import * as adminApi from "../api/admin";
import { analyticsReport, analyticsSummary } from "../api/analytics";
import { fetchCurated, deleteProject } from "../api/projects";
import type { Project } from "../types";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncMeta, setSyncMeta] = useState<any>(null);
  const [bench, setBench] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [curated, setCurated] = useState<Project[]>([]);

  const refresh = async () => {
    const [meta, sum, rep, list] = await Promise.all([
      adminApi.syncStatus(),
      analyticsSummary(),
      analyticsReport("weekly"),
      fetchCurated(),
    ]);
    setSyncMeta(meta);
    setSummary(sum);
    setReport(rep);
    setCurated(list);
  };

  useEffect(() => {
    authApi
      .me()
      .then((m) => {
        setUser(m.email);
        return refresh();
      })
      .catch(() => setUser(null));
  }, []);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await authApi.login(email, password);
      const m = await authApi.me();
      setUser(m.email);
      await refresh();
    } catch {
      setError("Invalid credentials");
    }
  };

  if (!user) {
    return (
      <div className="studio-wash flex min-h-screen items-center justify-center px-4">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onLogin}
          className="surface w-full max-w-md space-y-4 p-8 shadow-soft"
        >
          <h1 className="font-heading text-2xl font-semibold text-ink-900 dark:text-linen-50">
            Admin login
          </h1>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          {error ? <p className="text-sm text-red-700 dark:text-red-400">{error}</p> : null}
          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
          <Link
            to="/"
            className="block text-center text-sm text-ink-500 hover:text-sage-600 dark:text-ink-400"
          >
            ← Back to site
          </Link>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="studio-wash mx-auto min-h-screen max-w-5xl px-5 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-ink-900 dark:text-linen-50">
            Admin
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">{user}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="btn-ghost">
            Site
          </Link>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              authApi.logout();
              setUser(null);
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card title="Page views" value={summary?.page_views ?? "—"} />
        <Card title="Sessions" value={summary?.sessions ?? "—"} />
        <Card title="Resume downloads" value={summary?.resume_downloads ?? "—"} />
      </div>

      <div className="surface mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-semibold text-ink-900 dark:text-linen-50">
              Sync Data
            </h2>
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Last sync: {syncMeta?.last_synced_at || "never"}
            </p>
          </div>
          <button
            type="button"
            className="btn-primary"
            disabled={syncing}
            onClick={async () => {
              setSyncing(true);
              try {
                await adminApi.syncData();
                await refresh();
              } finally {
                setSyncing(false);
              }
            }}
          >
            <FiRefreshCw className={syncing ? "animate-spin" : ""} /> Sync Data
          </button>
        </div>
        {syncMeta?.sources ? (
          <pre className="mt-4 overflow-auto rounded-md bg-ink-900 p-3 text-xs text-linen-200">
            {JSON.stringify(syncMeta.sources, null, 2)}
          </pre>
        ) : null}
      </div>

      <div className="surface mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-ink-900 dark:text-linen-50">
            Compare Cache
          </h2>
          <button
            type="button"
            className="btn-ghost"
            onClick={async () => setBench(await adminApi.cacheBenchmark(5))}
          >
            Run benchmark
          </button>
        </div>
        {bench ? (
          <pre className="mt-4 overflow-auto rounded-md bg-ink-900 p-3 text-xs text-linen-200">
            {JSON.stringify(bench, null, 2)}
          </pre>
        ) : null}
      </div>

      <div className="surface mt-6 p-6">
        <h2 className="font-heading text-xl font-semibold text-ink-900 dark:text-linen-50">
          Curated projects
        </h2>
        <ul className="mt-4 space-y-3">
          {curated.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-2 border border-linen-300 px-4 py-3 dark:border-ink-700"
            >
              <div>
                <div className="font-medium text-ink-900 dark:text-linen-50">{p.title}</div>
                <div className="text-xs text-ink-500 dark:text-ink-400">
                  {p.github_url || "no github"}
                </div>
              </div>
              <button
                type="button"
                className="text-sm text-red-700 dark:text-red-400"
                onClick={async () => {
                  if (!confirm(`Delete ${p.title}?`)) return;
                  await deleteProject(p.id);
                  await refresh();
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-500 dark:text-ink-400">
          TipTap rich editor can be added next — create/update via API{" "}
          <code>POST/PUT /api/projects</code>.
        </p>
      </div>

      {report?.top_countries?.length ? (
        <div className="surface mt-6 p-6">
          <h2 className="font-heading text-xl font-semibold text-ink-900 dark:text-linen-50">
            Top countries
          </h2>
          <ul className="mt-3 space-y-1 text-sm text-ink-700 dark:text-linen-200">
            {report.top_countries.map((c: { country: string; count: number }) => (
              <li key={c.country}>
                {c.country}: {c.count}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="surface p-5">
      <div className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">{title}</div>
      <div className="mt-2 font-heading text-3xl font-semibold text-sage-600 dark:text-sage-300">
        {value}
      </div>
    </div>
  );
}
