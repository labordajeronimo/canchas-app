import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/me — devuelve el usuario logueado (útil para probar 401)
router.get("/", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;
