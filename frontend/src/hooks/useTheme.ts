import { useEffect, useState } from "react";

const SESSION_KEY = "portfolio_theme_session";

/**
 * Default theme is always light on a new visit / tab / shared link.
 * Toggle choice is kept in sessionStorage so SPA navigations in the same tab keep it.
 */
export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      if (session === "dark" || session === "light") return session;
    } catch {
      /* ignore */
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    try {
      sessionStorage.setItem(SESSION_KEY, theme);
      localStorage.removeItem("portfolio_theme");
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}
