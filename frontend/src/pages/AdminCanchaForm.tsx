import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CanchaForm from "../components/CanchaForm";
import { canchasApi } from "../lib/api";
import type { Cancha } from "../lib/types";
import type { CanchaFormValues } from "../schemas/cancha";

export default function AdminCanchaForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [cancha, setCancha] = useState<Cancha | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) canchasApi.get(id).then(setCancha).catch((e) => setError(e.message));
  }, [id]);

  const defaults = useMemo<Partial<CanchaFormValues> | undefined>(() => {
    if (!cancha) return undefined;
    return {
      nombre: cancha.nombre,
      club: cancha.club,
      direccion: cancha.direccion,
      precioPorHora: cancha.precioPorHora,
      techada: cancha.techada,
      superficie: cancha.superficie,
      paredes: cancha.paredes,
      fechaInauguracion: cancha.fechaInauguracion.slice(0, 10),
    };
  }, [cancha]);

  async function onSubmit(values: CanchaFormValues) {
    if (editing) await canchasApi.update(id!, values);
    else await canchasApi.create(values);
    navigate("/admin");
  }

  if (error) return <p className="alert">{error}</p>;
  if (editing && !cancha) return <div className="loader">Cargando…</div>;

  return (
    <div className="narrow">
      <Link to="/admin" className="back">← Volver al panel</Link>
      <h1>{editing ? "Editar cancha" : "Nueva cancha"}</h1>
      <CanchaForm defaultValues={defaults} submitLabel={editing ? "Guardar cambios" : "Crear cancha"} onSubmit={onSubmit} />
    </div>
  );
}
