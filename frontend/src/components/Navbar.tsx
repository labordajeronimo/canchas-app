import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut, useSession } from "../lib/auth-client";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const isAdmin = session?.user.role === "admin";

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" aria-label="Canchas Rosario, inicio">
          <span className="brand-ball" aria-hidden />
          Canchas Rosario
        </Link>
        <nav className="nav-links" aria-label="Principal">
          <NavLink to="/" end>Canchas</NavLink>
          {isAdmin && <NavLink to="/admin" end>Administrar</NavLink>}
          {isAdmin && <NavLink to="/admin/usuarios">Usuarios</NavLink>}
        </nav>
        <div className="nav-user">
          {isPending ? null : session ? (
            <>
              <span className="user-chip" title={session.user.email}>
                {session.user.name || session.user.email}
                {isAdmin && <span className="role">admin</span>}
              </span>
              <button className="btn btn-quiet" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-quiet">Ingresar</Link>
              <Link to="/registro" className="btn btn-primary">Crear cuenta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
