import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError, canchasApi, formatFecha, formatPrecio } from "../lib/api";
import { useSession } from "../lib/auth-client";
import { PAREDES_LABEL, SUPERFICIE_LABEL, type Cancha } from "../lib/types";

export default function CanchaDetail() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [cancha, setCancha] = useState<Cancha | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    canchasApi
      .get(id!)
      .then(setCancha)
      .catch((e) => setError(e instanceof ApiError && e.status === 404 ? "Esta cancha no existe o fue eliminada." : e.message));
  }, [id]);

  if (error)
    return (
      <div className="empty card">
        <p>{error}</p>
        <Link to="/" className="btn btn-ghost">Volver al listado</Link>
      </div>
    );
  if (!cancha) return <div className="loader">Cargando…</div>;

  return (
    <article className="detail">
      <Link to="/" className="back">← Volver</Link>
      <div className="court court-lg" aria-hidden>
        <div className="court-net" />
        <span className={`tag ${cancha.techada ? "tag-on" : ""}`}>{cancha.techada ? "Techada" : "Al aire libre"}</span>
      </div>
      <div className="detail-head">
        <div>
          <p className="club">{cancha.club}</p>
          <h1>{cancha.nombre}</h1>
          <p className="muted">{cancha.direccion}</p>
        </div>
        <div className="price price-lg">{formatPrecio(cancha.precioPorHora)}<small>/hora</small></div>
      </div>
      <dl className="specs card">
        <div><dt>Superficie</dt><dd>{SUPERFICIE_LABEL[cancha.superficie]}</dd></div>
        <div><dt>Paredes</dt><dd>{PAREDES_LABEL[cancha.paredes]}</dd></div>
        <div><dt>Techada</dt><dd>{cancha.techada ? "Sí" : "No"}</dd></div>
        <div><dt>Inauguración</dt><dd>{formatFecha(cancha.fechaInauguracion)}</dd></div>
      </dl>
      {session?.user.role === "admin" && (
        <Link to={`/admin/canchas/${cancha._id}/editar`} className="btn btn-primary">Editar cancha</Link>
      )}
    </article>
  );
}
