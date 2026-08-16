import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGeeksforgeeks, SiLeetcode } from "react-icons/si";
import type { Profile } from "../types";

export default function SocialLinks({
  socials,
  email,
}: {
  socials: Profile["socials"];
  email?: string;
}) {
  const items = [
    { href: socials.github, label: "GitHub", Icon: FaGithub },
    { href: socials.linkedin, label: "LinkedIn", Icon: FaLinkedin },
    socials.leetcode ? { href: socials.leetcode, label: "LeetCode", Icon: SiLeetcode } : null,
    socials.geeksforgeeks
      ? { href: socials.geeksforgeeks, label: "GfG", Icon: SiGeeksforgeeks }
      : null,
  ].filter(Boolean) as { href: string; label: string; Icon: typeof FaGithub }[];

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {items.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="neon-edge rounded-md border border-linen-300 p-2 text-ink-700 transition dark:border-ink-700 dark:text-linen-200"
        >
          <Icon size={18} />
        </a>
      ))}
      {email ? (
        <a
          href={`mailto:${email}`}
          className="neon-edge rounded-md border border-linen-300 px-3 py-1.5 text-xs text-ink-600 transition dark:border-ink-700 dark:text-linen-200"
        >
          {email}
        </a>
      ) : null}
    </div>
  );
}
