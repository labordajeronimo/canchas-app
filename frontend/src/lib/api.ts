import type { Cancha, Paginado } from "./types";

export interface DetalleError {
  campo: string;
  mensaje: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public detalles: DetalleError[] = []) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body.error ?? "Error inesperado", body.detalles ?? []);
  return body as T;
}

export type CanchaInput = Omit<Cancha, "_id" | "createdAt" | "updatedAt">;

export interface ListParams {
  page?: number;
  limit?: number;
  q?: string;
  techada?: "true" | "false" | "";
  superficie?: string;
  orden?: string;
}

export const canchasApi = {
  list(params: ListParams = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") qs.set(k, String(v));
    });
    return request<Paginado<Cancha>>(`/canchas?${qs}`);
  },
  get: (id: string) => request<Cancha>(`/canchas/${id}`),
  create: (data: CanchaInput) => request<Cancha>("/canchas", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<CanchaInput>) =>
    request<Cancha>(`/canchas/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`/canchas/${id}`, { method: "DELETE" }),
};

export function formatPrecio(n: number) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export function formatFecha(iso: string) {
  // Las fechas se guardan a medianoche UTC: se muestran en UTC para no correr un día
  return new Date(iso).toLocaleDateString("es-AR", { timeZone: "UTC", day: "2-digit", month: "long", year: "numeric" });
}
