import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import CanchaDetail from "./pages/CanchaDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminCanchas from "./pages/AdminCanchas";
import AdminCanchaForm from "./pages/AdminCanchaForm";
import AdminUsuarios from "./pages/AdminUsuarios";
import SinPermisos from "./pages/SinPermisos";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/canchas/:id" element={<CanchaDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/sin-permisos" element={<SinPermisos />} />

          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdminCanchas />} />
            <Route path="/admin/canchas/nueva" element={<AdminCanchaForm />} />
            <Route path="/admin/canchas/:id/editar" element={<AdminCanchaForm />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">Canchas Rosario · Proyecto full stack con Express, React y Better Auth</footer>
    </>
  );
}
