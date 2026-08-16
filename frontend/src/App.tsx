import AnimatedBackground from "./components/AnimatedBackground";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import { useTheme } from "./hooks/useTheme";
import { useProfile } from "./hooks/useProfile";
import { usePageAnalytics } from "./hooks/usePageAnalytics";

export default function AppHome() {
  const { theme, toggle } = useTheme();
  const { profile, loading } = useProfile();
  usePageAnalytics();

  return (
    <>
      <AnimatedBackground />
      <Navbar profile={profile} theme={theme} onToggleTheme={toggle} />
      {loading ? (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden"
          aria-hidden
        >
          <div className="h-full w-1/3 animate-[shimmer-slide_1s_ease-in-out_infinite] bg-sage-500/80" />
        </div>
      ) : null}
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Experience profile={profile} />
        <Skills profile={profile} />
        <Projects />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
