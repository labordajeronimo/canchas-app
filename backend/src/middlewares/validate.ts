import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

/** Valida req.body con Zod. Si falla responde 400 con el detalle por campo. */
export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Datos inválidos",
        detalles: result.error.issues.map((i) => ({
          campo: i.path.join(".") || "(body)",
          mensaje: i.message,
        })),
      });
    }
    req.body = result.data;
    next();
  };
}
