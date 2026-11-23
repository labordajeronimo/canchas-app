import { useEffect, useState } from "react";
import { authClient, useSession } from "../lib/auth-client";

interface Usuario {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  createdAt: Date | string;
}

export default function AdminUsuarios() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  async function cargar() {
    const { data, error } = await authClient.admin.listUsers({ query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" } });
    if (error) setError(error.message ?? "No se pudieron cargar los usuarios");
    else setUsers(data.users as Usuario[]);
  }

  useEffect(() => {
    cargar();
  }, []);

  async function cambiarRol(u: Usuario, role: "admin" | "user") {
    setSaving(u.id);
    setError(null);
    const { error } = await authClient.admin.setRole({ userId: u.id, role });
    setSaving(null);
    if (error) setError(error.message ?? "No se pudo cambiar el rol");
    else setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role } : x)));
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Usuarios</h1>
          <p className="lede">Elegí quién puede administrar canchas. Los usuarios con rol user solo pueden consultar.</p>
        </div>
      </div>
      {error && <p className="alert">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Email</th><th>Alta</th><th>Rol</th></tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const yo = u.id === session?.user.id;
              return (
                <tr key={u.id}>
                  <td>{u.name} {yo && <span className="you">(vos)</span>}</td>
                  <td>{u.email}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString("es-AR")}</td>
                  <td>
                    <select
                      value={u.role ?? "user"}
                      disabled={yo || saving === u.id}
                      title={yo ? "No podés cambiar tu propio rol" : undefined}
                      onChange={(e) => cambiarRol(u, e.target.value as "admin" | "user")}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
