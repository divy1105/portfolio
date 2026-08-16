import { api } from "./client";

export async function fetchReadme(url: string): Promise<string> {
  const { data } = await api.get<{ html: string }>("/api/github/readme", { params: { url } });
  return data.html;
}
