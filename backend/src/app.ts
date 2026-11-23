import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { env } from "./lib/env.js";
import canchasRoutes from "./routes/canchas.routes.js";
import meRoutes from "./routes/me.routes.js";
import { errorHandler, notFound } from "./middlewares/error.js";

export const app = express();

// Render está detrás de un proxy: necesario para cookies "secure" e IP real
app.set("trust proxy", 1);

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));

// Better Auth va ANTES de express.json() (lee el body por su cuenta)
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/canchas", canchasRoutes);
app.use("/api/me", meRoutes);

app.use(notFound);
app.use(errorHandler);
