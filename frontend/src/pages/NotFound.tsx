import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="empty card">
      <h1>404</h1>
      <p className="muted">La página que buscás no existe.</p>
      <Link to="/" className="btn btn-ghost">Volver al inicio</Link>
    </div>
  );
}
