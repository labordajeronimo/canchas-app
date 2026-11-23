import { Link } from "react-router-dom";

export default function SinPermisos() {
  return (
    <div className="empty">
      <h1>No tenés permisos para esta sección</h1>
      <p>Solo los administradores pueden cargar, editar o borrar canchas. Si necesitás acceso, pedíselo a un admin.</p>
      <Link to="/" className="btn btn-quiet">Ver canchas</Link>
    </div>
  );
}
