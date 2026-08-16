/**
 * Theme-split hero atmosphere:
 * Light → Soft ivory gold (premium directional light + grain; own look)
 * Dark → colored light beams + grain
 *
 * Uses CSS `dark:` so theme always matches html.dark (no JS lag).
 */
export default function HeroAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* —— DARK: colored beams + grain —— */}
      <div className="absolute inset-0 hidden dark:block">
        <div className="hero-dark-base absolute inset-0" />
        <div className="hero-dark-washes absolute inset-0" />
        <div className="hero-dark-rays absolute inset-0" />
        <div className="hero-dark-grain absolute inset-0" />
      </div>

      {/* —— LIGHT: Soft ivory gold —— */}
      <div className="absolute inset-0 dark:hidden">
        <div className="hero-light-base absolute inset-0" />
        <div className="hero-light-washes absolute inset-0" />
        <div className="hero-light-direction absolute inset-0" />
        <div className="hero-light-grain absolute inset-0" />
      </div>
    </div>
  );
}
