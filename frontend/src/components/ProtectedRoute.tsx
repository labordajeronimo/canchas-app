import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "../lib/auth-client";

/** Sin sesión → /login. Con sesión pero sin el rol → /sin-permisos. */
export default function ProtectedRoute({ role }: { role?: string }) {
  const { data: session, isPending } = useSession();
  const location = useLocation();

  if (isPending) return <div className="loader">Cargando sesión…</div>;
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && session.user.role !== role) return <Navigate to="/sin-permisos" replace />;
  return <Outlet />;
}
