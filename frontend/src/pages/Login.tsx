import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { signIn, useSession } from "../lib/auth-client";
import { loginSchema, type LoginValues } from "../schemas/auth";
import SocialButtons from "../components/SocialButtons";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  if (session) return <Navigate to={from} replace />;

  async function onSubmit(values: LoginValues) {
    const { error } = await signIn.email(values);
    if (error) {
      setError("root", { message: error.status === 401 ? "Email o contraseña incorrectos" : error.message ?? "No se pudo ingresar" });
      return;
    }
    navigate(from, { replace: true });
  }

  return (
    <div className="auth card">
      <h1>Ingresar</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
        <label className={`field ${errors.email ? "has-error" : ""}`}>
          <span>Email</span>
          <input type="email" autoComplete="email" {...register("email")} />
          {errors.email && <small className="error">{errors.email.message}</small>}
        </label>
        <label className={`field ${errors.password ? "has-error" : ""}`}>
          <span>Contraseña</span>
          <input type="password" autoComplete="current-password" {...register("password")} />
          {errors.password && <small className="error">{errors.password.message}</small>}
        </label>
        {errors.root && <p className="alert">{errors.root.message}</p>}
        <button className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Ingresando…" : "Ingresar"}</button>
      </form>
      <div className="divider"><span>o</span></div>
      <SocialButtons />
      <p className="muted small center">¿No tenés cuenta? <Link to="/registro">Registrate</Link></p>
    </div>
  );
}
