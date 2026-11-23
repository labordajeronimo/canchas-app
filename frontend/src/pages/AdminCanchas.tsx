import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import { canchasApi, formatPrecio } from "../lib/api";
import type { Cancha, Paginado } from "../lib/types";

export default function AdminCanchas() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [result, setResult] = useState<Paginado<Cancha> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      canchasApi.list({ page, limit: 10, q }).then(setResult).catch((e) => setError(e.message));
    }, 250);
    return () => clearTimeout(t);
  }, [page, q, reload]);

  async function eliminar(c: Cancha) {
    if (!confirm(`¿Eliminar "${c.nombre}" de ${c.club}?`)) return;
    try {
      await canchasApi.remove(c._id);
      if (result && result.data.length === 1 && page > 1) setPage(page - 1);
      else setReload((r) => r + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar");
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Panel de admin</h1>
          <p className="muted">Alta, baja y modificación de canchas.</p>
        </div>
        <Link to="/admin/canchas/nueva" className="btn btn-primary">+ Nueva cancha</Link>
      </div>

      <input className="search card" type="search" placeholder="Buscar…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />

      {error && <p className="alert">{error}</p>}

      <div className="table-wrap card">
        <table>
          <thead>
            <tr><th>Cancha</th><th>Club</th><th>Precio/h</th><th>Techada</th><th></th></tr>
          </thead>
          <tbody>
            {result?.data.map((c) => (
              <tr key={c._id}>
                <td><Link to={`/canchas/${c._id}`}>{c.nombre}</Link></td>
                <td>{c.club}</td>
                <td>{formatPrecio(c.precioPorHora)}</td>
                <td>{c.techada ? "Sí" : "No"}</td>
                <td className="actions">
                  <Link to={`/admin/canchas/${c._id}/editar`} className="btn btn-ghost btn-sm">Editar</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => eliminar(c)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {result && result.data.length === 0 && (
              <tr><td colSpan={5} className="muted center">No hay canchas cargadas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {result && <Pagination page={result.page} totalPages={result.totalPages} onChange={setPage} />}
    </>
  );
}
