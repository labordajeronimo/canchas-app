export default function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Paginación">
      <button className="btn btn-ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>← Anterior</button>
      <span className="muted">Página {page} de {totalPages}</span>
      <button className="btn btn-ghost" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Siguiente →</button>
    </nav>
  );
}
