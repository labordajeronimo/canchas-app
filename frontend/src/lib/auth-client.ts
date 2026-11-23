import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

// Mismo origen que el frontend: /api/auth/* se reescribe al backend (Vite proxy en local, rewrite en Render)
export const authClient = createAuthClient({
  baseURL: window.location.origin,
  plugins: [adminClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
