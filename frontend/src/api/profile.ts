import { api } from "./client";
import type { Profile } from "../types";

export async function fetchProfile(): Promise<Profile> {
  const { data } = await api.get<Profile>("/api/profile/");
  return data;
}
