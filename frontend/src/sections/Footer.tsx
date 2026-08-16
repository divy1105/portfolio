import { Link } from "react-router-dom";
import type { Profile } from "../types";
import SocialLinks from "../components/SocialLinks";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-linen-300 dark:border-ink-700">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-10 sm:flex-row sm:justify-between sm:px-8">
        <div className="text-sm text-ink-500 dark:text-ink-400">
          © {new Date().getFullYear()}{" "}
          <span className="font-heading font-medium text-ink-800 dark:text-linen-100">
            {profile.name}
          </span>
        </div>
        <SocialLinks socials={profile.socials} email={profile.email} />
        <Link
          to="/admin"
          className="text-xs text-ink-400 transition hover:text-sage-600 dark:hover:text-sage-300"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}
