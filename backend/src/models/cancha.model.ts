import { Schema, model, type InferSchemaType } from "mongoose";

export const SUPERFICIES = ["cesped-sintetico", "cemento"] as const;
export const PAREDES = ["blindex", "muro"] as const;

const canchaSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },          // texto
    club: { type: String, required: true, trim: true },            // texto
    direccion: { type: String, required: true, trim: true },       // texto
    precioPorHora: { type: Number, required: true, min: 0 },       // número
    techada: { type: Boolean, default: false },                    // booleano
    superficie: { type: String, enum: SUPERFICIES, required: true },
    paredes: { type: String, enum: PAREDES, required: true },
    fechaInauguracion: { type: Date, required: true },             // fecha
    creadoPor: { type: String },                                   // id del admin que la cargó
  },
  { timestamps: true, versionKey: false },
);

canchaSchema.index({ nombre: "text", club: "text", direccion: "text" });

export type Cancha = InferSchemaType<typeof canchaSchema>;
export const CanchaModel = model("Cancha", canchaSchema, "canchas");
