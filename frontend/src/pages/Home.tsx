import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CanchaCard from "../components/CanchaCard";
import Court from "../components/Court";
import Pagination from "../components/Pagination";
import { canchasApi } from "../lib/api";
import { SUPERFICIES, SUPERFICIE_LABEL, type Cancha, type Paginado } from "../lib/types";

const TECHADA_OPCIONES = [
  { value: "", label: "Todas" },
  { value: "true", label: "Techadas" },
  { value: "false", label: "Al aire libre" },
] as const;

export default function Home() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") ?? 1);
  const q = params.get("q") ?? "";
  const techada = (params.get("techada") ?? "") as "" | "true" | "false";
  const superficie = params.get("superficie") ?? "";
  const orden = params.get("orden") ?? "recientes";

  const [busqueda, setBusqueda] = useState(q);
  const [result, setResult] = useState<Paginado<Cancha> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function update(next: Record<string, string>) {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    if (!("page" in next)) p.delete("page");
    setParams(p);
  }

  // Búsqueda con debounce
  useEffect(() => {
    const t = setTimeout(() => {
      if (busqueda !== q) update({ q: busqueda });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    canchasApi
      .list({ page, limit: 6, q, techada, superficie, orden })
      .then(setResult)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page, q, techada, superficie, orden]);

  const hayFiltros = Boolean(q || techada || superficie);

  return (
    <>
      <section className="hero">
        <Court className="hero-court" horizontal ball />
        <div className="hero-copy">
          <h1>Canchas de pádel en Rosario</h1>
          <p>Compará precio por hora, superficie y paredes antes de reservar.</p>
          <label className="hero-search">
            <span className="sr-only">Buscar</span>
            <input
              type="search"
              placeholder="Buscá por cancha, club o calle"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="toolbar" aria-label="Filtros">
        <div className="segmented" role="group" aria-label="Techo">
          {TECHADA_OPCIONES.map((o) => (
            <button
              key={o.value}
              type="button"
              aria-pressed={techada === o.value}
              onClick={() => update({ techada: o.value })}
            >
              {o.label}
            </button>
          ))}
        </div>
        <label className="select">
          <span>Superficie</span>
          <select value={superficie} onChange={(e) => update({ superficie: e.target.value })}>
            <option value="">Cualquiera</option>
            {SUPERFICIES.map((s) => <option key={s} value={s}>{SUPERFICIE_LABEL[s]}</option>)}
          </select>
        </label>
        <label className="select">
          <span>Ordenar</span>
          <select value={orden} onChange={(e) => update({ orden: e.target.value === "recientes" ? "" : e.target.value })}>
            <option value="recientes">Más nuevas primero</option>
            <option value="precio-asc">Más baratas primero</option>
            <option value="precio-desc">Más caras primero</option>
          </select>
        </label>
        {result && <p className="count">{result.total} {result.total === 1 ? "cancha" : "canchas"}</p>}
      </section>

      {error && <p className="alert">No se pudieron cargar las canchas: {error}</p>}
      {loading && !result && <p className="loader">Cargando canchas…</p>}

      {result && (
        result.data.length === 0 ? (
          <div className="empty">
            <p>No hay canchas con esos filtros.</p>
            {hayFiltros && (
              <button className="btn btn-quiet" onClick={() => { setBusqueda(""); setParams(new URLSearchParams()); }}>
                Quitar filtros
              </button>
            )}
          </div>
        ) : (
          <ul className={`rows ${loading ? "is-loading" : ""}`}>
            {result.data.map((c) => <CanchaCard key={c._id} cancha={c} />)}
          </ul>
        )
      )}
      {result && <Pagination page={result.page} totalPages={result.totalPages} onChange={(p) => update({ page: String(p) })} />}
    </>
  );
}
