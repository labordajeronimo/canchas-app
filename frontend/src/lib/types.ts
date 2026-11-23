export const SUPERFICIES = ["cesped-sintetico", "cemento"] as const;
export const PAREDES = ["blindex", "muro"] as const;

export type Superficie = (typeof SUPERFICIES)[number];
export type Paredes = (typeof PAREDES)[number];

export const SUPERFICIE_LABEL: Record<Superficie, string> = {
  "cesped-sintetico": "Césped sintético",
  cemento: "Cemento",
};
export const PAREDES_LABEL: Record<Paredes, string> = {
  blindex: "Blindex",
  muro: "Muro",
};

export interface Cancha {
  _id: string;
  nombre: string;
  club: string;
  direccion: string;
  precioPorHora: number;
  techada: boolean;
  superficie: Superficie;
  paredes: Paredes;
  fechaInauguracion: string;
  createdAt: string;
  updatedAt: string;
}

export interface Paginado<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
