export type Profile = {
  name: string;
  role: string;
  title: string;
  tagline: string;
  location: string;
  status: string;
  email: string;
  resume_drive_url: string;
  resume_pdf: string;
  socials: {
    github: string;
    linkedin: string;
    leetcode: string | null;
    geeksforgeeks: string | null;
  };
  about: string[];
  facts: { label: string; value: string }[];
  education: {
    degree: string;
    institution: string;
    start: string;
    end: string;
    score: string;
  }[];
  achievements: string[];
  experience: {
    role: string;
    company: string;
    location: string;
    start: string;
    end: string;
    current: boolean;
    highlights: string[];
  }[];
  skills: Record<string, string[]>;
  contact_invite: string;
};

export type Project = {
  id: string;
  title: string;
  description?: string;
  content_html?: string;
  tech?: string[];
  github_url?: string | null;
  demo_url?: string | null;
  thumbnail?: string | null;
  featured?: boolean;
  order?: number;
  source?: string;
  stars?: number;
  language?: string;
};

export type LeetCodeStats = {
  username: string | null;
  ranking: number | null;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  reputation: number;
  contestRating: number | null;
  contestsAttended: number;
  topContests: { title?: string; ranking?: number; rating?: number }[];
  source: string;
};
