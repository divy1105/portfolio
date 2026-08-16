import { api } from "./client";

export async function syncData() {
  const { data } = await api.post("/api/admin/sync");
  return data;
}

export async function syncStatus() {
  const { data } = await api.get("/api/admin/sync/status");
  return data;
}

export async function cacheBenchmark(rounds = 5) {
  const { data } = await api.get("/api/admin/cache-benchmark", { params: { rounds } });
  return data;
}
