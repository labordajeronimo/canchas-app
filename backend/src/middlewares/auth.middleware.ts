import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth, type Session } from "../lib/auth.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: Session["user"];
      session?: Session["session"];
    }
  }
}

/** 401 si no hay sesión válida. Deja req.user y req.session cargados. */
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const data = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!data) {
    return res.status(401).json({ error: "No autenticado. Iniciá sesión." });
  }
  req.user = data.user;
  req.session = data.session;
  next();
}

/** 403 si el usuario logueado no tiene alguno de los roles pedidos. Usar después de authMiddleware. */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role ?? "user";
    if (!roles.includes(role)) {
      return res.status(403).json({ error: "No tenés permisos para realizar esta acción." });
    }
    next();
  };
}
