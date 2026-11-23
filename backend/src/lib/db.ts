import dns from "node:dns";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { env } from "./env.js";

// Las URIs mongodb+srv:// necesitan una consulta DNS SRV. En algunas PCs con Windows
// (VPN, antivirus o "DNS seguro") Node usa 127.0.0.1 como DNS y esa consulta falla
// con "querySrv ECONNREFUSED". Por eso se usan DNS públicos por defecto.
// Para usar el DNS del sistema: DNS_SERVERS=system. Para otros: DNS_SERVERS=9.9.9.9,1.0.0.1
const dnsServers = process.env.DNS_SERVERS ?? "8.8.8.8,1.1.1.1";
if (dnsServers !== "system") {
  dns.setServers(dnsServers.split(",").map((s) => s.trim()).filter(Boolean));
}

// Cliente nativo que usa Better Auth (colecciones user, session, account, verification)
export const mongoClient = new MongoClient(env.MONGODB_URI);
export const authDb = mongoClient.db();

// Mongoose para la entidad propia (canchas)
export async function connectDB() {
  await mongoClient.connect();
  await mongoose.connect(env.MONGODB_URI);
  console.log("✅ Conectado a MongoDB");
}
