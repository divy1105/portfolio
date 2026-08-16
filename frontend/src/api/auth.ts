import { api } from "./client";

export async function login(email: string, password: string) {
  const { data } = await api.post<{ access_token: string }>("/api/auth/login", { email, password });
  localStorage.setItem("portfolio_admin_token", data.access_token);
  return data;
}

export async function me() {
  const { data } = await api.get<{ email: string }>("/api/auth/me");
  return data;
}

export function logout() {
  localStorage.removeItem("portfolio_admin_token");
}
