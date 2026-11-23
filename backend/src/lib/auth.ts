import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { authDb, mongoClient } from "./db.js";
import { env } from "./env.js";

const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};
if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET };
}
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET };
}

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(authDb, { client: mongoClient }),
  trustedOrigins: [env.FRONTEND_URL],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders,
  plugins: [
    // Agrega el campo `role` al usuario (por defecto "user") y los endpoints de admin (setRole, listUsers...)
    admin({ defaultRole: "user", adminRoles: ["admin"] }),
  ],
});

export type Session = typeof auth.$Infer.Session;
