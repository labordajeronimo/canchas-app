import { Router, type Request, type Response } from "express";
import { isValidObjectId, type SortOrder } from "mongoose";
import { CanchaModel } from "../models/cancha.model.js";
import { createCanchaSchema, listQuerySchema, updateCanchaSchema } from "../schemas/cancha.schema.js";
import { validateBody } from "../middlewares/validate.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/canchas?page=1&limit=6&q=centro&techada=true&superficie=cemento&orden=precio-asc  (público)
router.get("/", async (req: Request, res: Response) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Parámetros de búsqueda inválidos",
      detalles: parsed.error.issues.map((i) => ({ campo: i.path.join("."), mensaje: i.message })),
    });
  }
  const { page, limit, q, techada, superficie, orden } = parsed.data;

  const filtro: Record<string, unknown> = {};
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    filtro.$or = [{ nombre: rx }, { club: rx }, { direccion: rx }];
  }
  if (techada) filtro.techada = techada === "true";
  if (superficie) filtro.superficie = superficie;

  const sort: Record<string, SortOrder> =
    orden === "precio-asc" ? { precioPorHora: 1 } : orden === "precio-desc" ? { precioPorHora: -1 } : { createdAt: -1 };

  const [data, total] = await Promise.all([
    CanchaModel.find(filtro).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    CanchaModel.countDocuments(filtro),
  ]);

  res.json({ data, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) });
});

// GET /api/canchas/:id  (público)
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(404).json({ error: "Cancha no encontrada" });
  const cancha = await CanchaModel.findById(id).lean();
  if (!cancha) return res.status(404).json({ error: "Cancha no encontrada" });
  res.json(cancha);
});

// POST /api/canchas  (admin)
router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  validateBody(createCanchaSchema),
  async (req: Request, res: Response) => {
    const cancha = await CanchaModel.create({ ...req.body, creadoPor: req.user!.id });
    res.status(201).json(cancha);
  },
);

// PUT y PATCH /api/canchas/:id  (admin) — actualización parcial
const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(404).json({ error: "Cancha no encontrada" });
  const cancha = await CanchaModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).lean();
  if (!cancha) return res.status(404).json({ error: "Cancha no encontrada" });
  res.json(cancha);
};
router.put("/:id", authMiddleware, requireRole("admin"), validateBody(updateCanchaSchema), update);
router.patch("/:id", authMiddleware, requireRole("admin"), validateBody(updateCanchaSchema), update);

// DELETE /api/canchas/:id  (admin)
router.delete("/:id", authMiddleware, requireRole("admin"), async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(404).json({ error: "Cancha no encontrada" });
  const cancha = await CanchaModel.findByIdAndDelete(id).lean();
  if (!cancha) return res.status(404).json({ error: "Cancha no encontrada" });
  res.status(204).send();
});

export default router;
