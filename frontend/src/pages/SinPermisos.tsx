import { Link } from "react-router-dom";

export default function SinPermisos() {
  return (
    <div className="empty card">
      <h1>403 · Sin permisos</h1>
      <p className="muted">Esta sección es solo para administradores.</p>
      <Link to="/" className="btn btn-ghost">Volver al inicio</Link>
    </div>
  );
}
