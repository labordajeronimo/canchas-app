import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CanchaCard from "../components/CanchaCard";
import Pagination from "../components/Pagination";
import { canchasApi } from "../lib/api";
import { SUPERFICIES, SUPERFICIE_LABEL, type Cancha, type Paginado } from "../lib/types";

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

  return (
    <>
      <section className="hero">
        <h1>Encontrá tu cancha de pádel <span className="accent">en Rosario</span></h1>
        <p className="muted">Precios, superficie, paredes y si es techada. Todo en un solo lugar.</p>
      </section>

      <section className="filters card">
        <input
          className="search"
          type="search"
          placeholder="Buscar por cancha, club o dirección…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={techada} onChange={(e) => update({ techada: e.target.value })}>
          <option value="">Techada y aire libre</option>
          <option value="true">Solo techadas</option>
          <option value="false">Solo aire libre</option>
        </select>
        <select value={superficie} onChange={(e) => update({ superficie: e.target.value })}>
          <option value="">Cualquier superficie</option>
          {SUPERFICIES.map((s) => <option key={s} value={s}>{SUPERFICIE_LABEL[s]}</option>)}
        </select>
        <select value={orden} onChange={(e) => update({ orden: e.target.value === "recientes" ? "" : e.target.value })}>
          <option value="recientes">Más recientes</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
        </select>
      </section>

      {error && <p className="alert">{error}</p>}
      {loading && !result && <div className="loader">Cargando canchas…</div>}

      {result && (
        <>
          <p className="muted small result-count">{result.total} {result.total === 1 ? "cancha encontrada" : "canchas encontradas"}</p>
          {result.data.length === 0 ? (
            <div className="empty card">No hay canchas que coincidan con la búsqueda.</div>
          ) : (
            <div className={`grid ${loading ? "is-loading" : ""}`}>
              {result.data.map((c) => <CanchaCard key={c._id} cancha={c} />)}
            </div>
          )}
          <Pagination page={result.page} totalPages={result.totalPages} onChange={(p) => update({ page: String(p) })} />
        </>
      )}
    </>
  );
}
