import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signUp, useSession } from "../lib/auth-client";
import { registerSchema, type RegisterValues } from "../schemas/auth";
import SocialButtons from "../components/SocialButtons";

export default function Register() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  if (session) return <Navigate to="/" replace />;

  async function onSubmit({ name, email, password }: RegisterValues) {
    const { error } = await signUp.email({ name, email, password });
    if (error) {
      const yaExiste = error.code === "USER_ALREADY_EXISTS" || error.status === 422;
      setError(yaExiste ? "email" : "root", { message: yaExiste ? "Ya existe una cuenta con ese email" : error.message ?? "No se pudo registrar" });
      return;
    }
    navigate("/", { replace: true });
  }

  return (
    <div className="auth card">
      <h1>Crear cuenta</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
        <label className={`field ${errors.name ? "has-error" : ""}`}>
          <span>Nombre</span>
          <input autoComplete="name" {...register("name")} />
          {errors.name && <small className="error">{errors.name.message}</small>}
        </label>
        <label className={`field ${errors.email ? "has-error" : ""}`}>
          <span>Email</span>
          <input type="email" autoComplete="email" {...register("email")} />
          {errors.email && <small className="error">{errors.email.message}</small>}
        </label>
        <label className={`field ${errors.password ? "has-error" : ""}`}>
          <span>Contraseña</span>
          <input type="password" autoComplete="new-password" {...register("password")} />
          {errors.password && <small className="error">{errors.password.message}</small>}
        </label>
        <label className={`field ${errors.confirm ? "has-error" : ""}`}>
          <span>Repetir contraseña</span>
          <input type="password" autoComplete="new-password" {...register("confirm")} />
          {errors.confirm && <small className="error">{errors.confirm.message}</small>}
        </label>
        {errors.root && <p className="alert">{errors.root.message}</p>}
        <button className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Creando…" : "Crear cuenta"}</button>
      </form>
      <div className="divider"><span>o</span></div>
      <SocialButtons />
      <p className="muted small center">¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></p>
    </div>
  );
}
