/**
 * Crea los usuarios de prueba (admin y user) y algunas canchas de ejemplo.
 * Uso: npm run seed   (lee las variables SEED_* del .env)
 */
import mongoose from "mongoose";
import { auth } from "../lib/auth.js";
import { authDb, connectDB, mongoClient } from "../lib/db.js";
import { CanchaModel } from "../models/cancha.model.js";

async function ensureUser(email: string, password: string, name: string, role: "admin" | "user") {
  const users = authDb.collection("user");
  let existing = await users.findOne({ email });
  if (!existing) {
    await auth.api.signUpEmail({ body: { email, password, name } });
    existing = await users.findOne({ email });
    console.log(`👤 Usuario creado: ${email}`);
  } else {
    console.log(`👤 Ya existía: ${email}`);
  }
  await users.updateOne({ email }, { $set: { role } });
  console.log(`   rol → ${role}`);
}

const canchas = [
  { nombre: "Cancha 1", club: "Pádel Oroño", direccion: "Bv. Oroño 1500, Rosario", precioPorHora: 18000, techada: true, superficie: "cesped-sintetico", paredes: "blindex", fechaInauguracion: new Date("2021-03-15") },
  { nombre: "Cancha Central", club: "Club Fisherton", direccion: "Av. Eva Perón 8200, Rosario", precioPorHora: 15000, techada: false, superficie: "cesped-sintetico", paredes: "blindex", fechaInauguracion: new Date("2019-11-02") },
  { nombre: "Cancha 3", club: "La Pared Pádel", direccion: "Mendoza 3200, Rosario", precioPorHora: 12000, techada: true, superficie: "cemento", paredes: "muro", fechaInauguracion: new Date("2015-06-20") },
  { nombre: "Cancha Río", club: "Costanera Pádel", direccion: "Av. de la Costa 500, Rosario", precioPorHora: 20000, techada: false, superficie: "cesped-sintetico", paredes: "blindex", fechaInauguracion: new Date("2023-09-10") },
  { nombre: "Cancha 2", club: "Pádel Oroño", direccion: "Bv. Oroño 1500, Rosario", precioPorHora: 18000, techada: true, superficie: "cesped-sintetico", paredes: "blindex", fechaInauguracion: new Date("2021-03-15") },
  { nombre: "Cancha Norte", club: "Arroyito Pádel", direccion: "Av. Alberdi 900, Rosario", precioPorHora: 13000, techada: false, superficie: "cemento", paredes: "muro", fechaInauguracion: new Date("2017-01-08") },
  { nombre: "Cancha Panorámica", club: "Funes Pádel Center", direccion: "Ruta 9 km 315, Funes", precioPorHora: 22000, techada: true, superficie: "cesped-sintetico", paredes: "blindex", fechaInauguracion: new Date("2024-04-01") },
];

async function main() {
  const { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_USER_EMAIL, SEED_USER_PASSWORD } = process.env;
  if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD || !SEED_USER_EMAIL || !SEED_USER_PASSWORD) {
    throw new Error("Completá SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_USER_EMAIL y SEED_USER_PASSWORD en el .env");
  }
  await connectDB();

  await ensureUser(SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, "Admin Canchas", "admin");
  await ensureUser(SEED_USER_EMAIL, SEED_USER_PASSWORD, "Usuario Común", "user");

  if ((await CanchaModel.countDocuments()) === 0) {
    await CanchaModel.insertMany(canchas);
    console.log(`🎾 ${canchas.length} canchas de ejemplo cargadas`);
  } else {
    console.log("🎾 Ya había canchas, no se cargaron ejemplos");
  }

  await mongoose.disconnect();
  await mongoClient.close();
}

main().catch(async (err) => {
  console.error(err);
  await mongoClient.close().catch(() => {});
  process.exit(1);
});
