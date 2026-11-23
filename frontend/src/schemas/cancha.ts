import { z } from "zod";
import { PAREDES, SUPERFICIES } from "../lib/types";

export const canchaFormSchema = z.object({
  nombre: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres").max(80, "Máximo 80 caracteres"),
  club: z.string().trim().min(2, "El club debe tener al menos 2 caracteres").max(80, "Máximo 80 caracteres"),
  direccion: z.string().trim().min(5, "La dirección debe tener al menos 5 caracteres").max(120, "Máximo 120 caracteres"),
  precioPorHora: z
    .number({ error: "Ingresá un precio" })
    .positive("El precio debe ser mayor a 0")
    .max(1_000_000, "Precio demasiado alto"),
  techada: z.boolean(),
  superficie: z.enum(SUPERFICIES, { error: "Elegí una superficie" }),
  paredes: z.enum(PAREDES, { error: "Elegí el tipo de paredes" }),
  fechaInauguracion: z
    .string()
    .min(1, "Ingresá la fecha de inauguración")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha inválida"),
});

export type CanchaFormValues = z.infer<typeof canchaFormSchema>;
