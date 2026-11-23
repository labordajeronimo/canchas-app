import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Court from "../components/Court";
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
      <div className="empty">
        <p>{error}</p>
        <Link to="/" className="btn btn-quiet">Ver todas las canchas</Link>
      </div>
    );
  if (!cancha) return <p className="loader">Cargando…</p>;

  return (
    <article className="detail">
      <Link to="/" className="back">Volver al listado</Link>
      <header className="detail-head">
        <div>
          <h1>{cancha.nombre}</h1>
          <p className="detail-club">{cancha.club}, {cancha.direccion}</p>
        </div>
        <p className="detail-price">
          <strong>{formatPrecio(cancha.precioPorHora)}</strong>
          <span>por hora</span>
        </p>
      </header>

      <div className="detail-plan">
        <Court horizontal superficie={cancha.superficie} paredes={cancha.paredes} techada={cancha.techada} className="detail-court" />
        <dl className="specs">
          <div><dt>Superficie</dt><dd>{SUPERFICIE_LABEL[cancha.superficie]}</dd></div>
          <div><dt>Paredes</dt><dd>{PAREDES_LABEL[cancha.paredes]}</dd></div>
          <div><dt>Techo</dt><dd>{cancha.techada ? "Techada" : "Al aire libre"}</dd></div>
          <div><dt>Inaugurada</dt><dd>{formatFecha(cancha.fechaInauguracion)}</dd></div>
        </dl>
      </div>

      {session?.user.role === "admin" && (
        <Link to={`/admin/canchas/${cancha._id}/editar`} className="btn btn-primary">Editar cancha</Link>
      )}
    </article>
  );
}
