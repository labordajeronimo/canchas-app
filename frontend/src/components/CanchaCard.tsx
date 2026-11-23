import { Link } from "react-router-dom";
import { formatPrecio } from "../lib/api";
import { PAREDES_LABEL, SUPERFICIE_LABEL, type Cancha } from "../lib/types";

export default function CanchaCard({ cancha }: { cancha: Cancha }) {
  return (
    <Link to={`/canchas/${cancha._id}`} className="card cancha-card">
      <div className="court" aria-hidden>
        <div className="court-net" />
        <span className={`tag ${cancha.techada ? "tag-on" : ""}`}>{cancha.techada ? "Techada" : "Al aire libre"}</span>
      </div>
      <div className="card-body">
        <p className="club">{cancha.club}</p>
        <h3>{cancha.nombre}</h3>
        <p className="muted small">{cancha.direccion}</p>
        <div className="card-foot">
          <span className="price">{formatPrecio(cancha.precioPorHora)}<small>/hora</small></span>
          <span className="muted small">{SUPERFICIE_LABEL[cancha.superficie]} · {PAREDES_LABEL[cancha.paredes]}</span>
        </div>
      </div>
    </Link>
  );
}
