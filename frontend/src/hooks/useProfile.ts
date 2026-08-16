import { useEffect, useState } from "react";
import { fetchProfile } from "../api/profile";
import { FALLBACK_PROFILE } from "../lib/fallback";
import type { Profile } from "../types";

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(FALLBACK_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchProfile()
      .then((p) => {
        if (alive) setProfile(p);
      })
      .catch(() => {
        if (alive) setProfile(FALLBACK_PROFILE);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { profile, loading };
}
