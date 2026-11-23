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
        <Link to="/" className="brand">
          <span className="ball" aria-hidden /> Canchas<span className="brand-dim">Rosario</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>Canchas</NavLink>
          {isAdmin && <NavLink to="/admin">Panel admin</NavLink>}
          {isAdmin && <NavLink to="/admin/usuarios">Usuarios</NavLink>}
        </nav>
        <div className="nav-user">
          {isPending ? null : session ? (
            <>
              <span className="user-chip">
                {session.user.name || session.user.email}
                <span className={`role role-${session.user.role ?? "user"}`}>{session.user.role ?? "user"}</span>
              </span>
              <button className="btn btn-ghost" onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Ingresar</Link>
              <Link to="/registro" className="btn btn-primary">Crear cuenta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
