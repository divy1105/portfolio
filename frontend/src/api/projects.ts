import { api } from "./client";
import type { Project } from "../types";

export async function fetchProjects(): Promise<Project[]> {
  const { data } = await api.get<Project[]>("/api/projects/");
  return data;
}

export async function fetchProject(id: string): Promise<Project> {
  const { data } = await api.get<Project>(`/api/projects/${id}`);
  return data;
}

export async function fetchProjectCount(): Promise<number> {
  const { data } = await api.get<{ count: number }>("/api/projects/count");
  return data.count;
}

export async function fetchCurated(): Promise<Project[]> {
  const { data } = await api.get<Project[]>("/api/projects/curated");
  return data;
}

export async function createProject(body: Partial<Project>) {
  const { data } = await api.post("/api/projects/", body);
  return data;
}

export async function updateProject(id: string, body: Partial<Project>) {
  const { data } = await api.put(`/api/projects/${id}`, body);
  return data;
}

export async function deleteProject(id: string) {
  const { data } = await api.delete(`/api/projects/${id}`);
  return data;
}
