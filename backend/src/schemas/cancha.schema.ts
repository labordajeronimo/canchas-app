import { z } from "zod";
import { PAREDES, SUPERFICIES } from "../models/cancha.model.js";

export const createCanchaSchema = z
  .object({
    nombre: z.string({ error: "El nombre es obligatorio" }).trim().min(3, "El nombre debe tener al menos 3 caracteres").max(80),
    club: z.string({ error: "El club es obligatorio" }).trim().min(2, "El club debe tener al menos 2 caracteres").max(80),
    direccion: z.string({ error: "La dirección es obligatoria" }).trim().min(5, "La dirección debe tener al menos 5 caracteres").max(120),
    precioPorHora: z.coerce
      .number({ error: "El precio debe ser un número" })
      .positive("El precio debe ser mayor a 0")
      .max(1_000_000, "Precio demasiado alto"),
    techada: z.boolean({ error: "techada debe ser true o false" }).default(false),
    superficie: z.enum(SUPERFICIES, { error: `La superficie debe ser: ${SUPERFICIES.join(", ")}` }),
    paredes: z.enum(PAREDES, { error: `Las paredes deben ser: ${PAREDES.join(", ")}` }),
    fechaInauguracion: z.coerce
      .date({ error: "La fecha de inauguración no es válida" })
      .max(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), "La fecha no puede ser más de un año en el futuro"),
  })
  .strict();

// PATCH/PUT: todos los campos opcionales, pero al menos uno
export const updateCanchaSchema = createCanchaSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: "Enviá al menos un campo para actualizar" });

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(6),
  q: z.string().trim().optional(),
  techada: z.enum(["true", "false"]).optional(),
  superficie: z.enum(SUPERFICIES).optional(),
  orden: z.enum(["recientes", "precio-asc", "precio-desc"]).default("recientes"),
});
