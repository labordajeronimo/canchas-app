import { Link } from "react-router-dom";
import Court from "./Court";
import { formatPrecio } from "../lib/api";
import { PAREDES_LABEL, SUPERFICIE_LABEL, type Cancha } from "../lib/types";

/** Fila del listado: plano en miniatura, datos y precio. */
export default function CanchaCard({ cancha }: { cancha: Cancha }) {
  return (
    <li>
      <Link to={`/canchas/${cancha._id}`} className="row">
        <Court className="row-court" superficie={cancha.superficie} paredes={cancha.paredes} techada={cancha.techada} />
        <div className="row-main">
          <h3>{cancha.nombre} <span className="row-club">en {cancha.club}</span></h3>
          <p className="row-dir">{cancha.direccion}</p>
          <ul className="facts" aria-label="Características">
            <li>{cancha.techada ? "Techada" : "Al aire libre"}</li>
            <li>{SUPERFICIE_LABEL[cancha.superficie]}</li>
            <li>Paredes de {PAREDES_LABEL[cancha.paredes].toLowerCase()}</li>
          </ul>
        </div>
        <p className="row-price">
          <strong>{formatPrecio(cancha.precioPorHora)}</strong>
          <span>por hora</span>
        </p>
      </Link>
    </li>
  );
}
