import type { Paredes, Superficie } from "../lib/types";

interface Props {
  superficie?: Superficie;
  paredes?: Paredes;
  techada?: boolean;
  horizontal?: boolean;
  ball?: boolean;
  className?: string;
}

/**
 * Plano de una cancha de pádel (10 × 20 m) visto desde arriba.
 * El dibujo codifica los datos: color = superficie, borde = tipo de pared, rayado = techada.
 */
export default function Court({ superficie = "cesped-sintetico", paredes = "blindex", techada = false, horizontal = false, ball = false, className }: Props) {
  const fill = superficie === "cemento" ? "var(--court-cement)" : "var(--court)";
  const wall = paredes === "muro" ? "var(--wall-solid)" : "var(--wall-glass)";
  const wallW = paredes === "muro" ? 5 : 3;
  const id = `roof-${superficie}-${paredes}-${horizontal ? "h" : "v"}`;

  // Coordenadas en vertical: pista de 100 × 200 dentro de un lienzo de 120 × 220
  const court = (
    <g>
      <rect x="10" y="10" width="100" height="200" fill={fill} />
      {techada && <rect x="10" y="10" width="100" height="200" fill={`url(#${id})`} />}
      {/* Líneas: servicio a 6,95 m de la red, línea central entre ellas */}
      <g stroke="var(--line)" strokeWidth="1.2" fill="none">
        <line x1="10" y1="40.5" x2="110" y2="40.5" />
        <line x1="10" y1="179.5" x2="110" y2="179.5" />
        <line x1="60" y1="40.5" x2="60" y2="179.5" />
      </g>
      {/* Red */}
      <line x1="6" y1="110" x2="114" y2="110" stroke="var(--line)" strokeWidth="2.4" />
      {/* Paredes: fondos completos y 4 m de laterales desde cada fondo */}
      <g stroke={wall} strokeWidth={wallW} fill="none" strokeLinecap="square">
        <polyline points="10,50 10,10 110,10 110,50" />
        <polyline points="10,170 10,210 110,210 110,170" />
      </g>
      <g stroke="var(--mesh)" strokeWidth="1.4" strokeDasharray="2 2.5">
        <line x1="10" y1="54" x2="10" y2="166" />
        <line x1="110" y1="54" x2="110" y2="166" />
      </g>
      {ball && <circle cx="82" cy="150" r="4.2" fill="var(--ball)" />}
    </g>
  );

  return (
    <svg
      className={className}
      viewBox={horizontal ? "0 0 220 120" : "0 0 120 220"}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Plano de cancha: ${superficie === "cemento" ? "cemento" : "césped sintético"}, paredes de ${paredes}, ${techada ? "techada" : "al aire libre"}`}
    >
      <defs>
        <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="var(--line)" strokeWidth="1.6" strokeOpacity="0.22" />
        </pattern>
      </defs>
      {horizontal ? <g transform="translate(0,120) rotate(-90)">{court}</g> : court}
    </svg>
  );
}
