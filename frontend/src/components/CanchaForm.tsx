import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { canchaFormSchema, type CanchaFormValues } from "../schemas/cancha";
import { PAREDES, PAREDES_LABEL, SUPERFICIES, SUPERFICIE_LABEL } from "../lib/types";
import { ApiError } from "../lib/api";

interface Props {
  defaultValues?: Partial<CanchaFormValues>;
  submitLabel: string;
  onSubmit: (values: CanchaFormValues) => Promise<void>;
}

const EMPTY: CanchaFormValues = {
  nombre: "",
  club: "",
  direccion: "",
  precioPorHora: NaN,
  techada: false,
  superficie: "cesped-sintetico",
  paredes: "blindex",
  fechaInauguracion: "",
};

export default function CanchaForm({ defaultValues, submitLabel, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CanchaFormValues>({
    resolver: zodResolver(canchaFormSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
  });

  useEffect(() => {
    if (defaultValues) reset({ ...EMPTY, ...defaultValues });
  }, [defaultValues, reset]);

  async function submit(values: CanchaFormValues) {
    try {
      await onSubmit(values);
    } catch (err) {
      if (err instanceof ApiError && err.detalles.length) {
        // Errores 400 del backend (Zod) → se muestran en cada campo
        err.detalles.forEach((d) => setError(d.campo as keyof CanchaFormValues, { message: d.mensaje }));
      } else {
        setError("root", { message: err instanceof Error ? err.message : "No se pudo guardar" });
      }
    }
  }

  return (
    <form className="form card" onSubmit={handleSubmit(submit)} noValidate>
      <div className="grid-2">
        <Field label="Nombre de la cancha" error={errors.nombre?.message}>
          <input {...register("nombre")} placeholder="Cancha 1" />
        </Field>
        <Field label="Club" error={errors.club?.message}>
          <input {...register("club")} placeholder="Pádel Oroño" />
        </Field>
      </div>

      <Field label="Dirección" error={errors.direccion?.message}>
        <input {...register("direccion")} placeholder="Bv. Oroño 1500, Rosario" />
      </Field>

      <div className="grid-2">
        <Field label="Precio por hora (ARS)" error={errors.precioPorHora?.message}>
          <input type="number" step="100" min="0" {...register("precioPorHora", { valueAsNumber: true })} placeholder="15000" />
        </Field>
        <Field label="Fecha de inauguración" error={errors.fechaInauguracion?.message}>
          <input type="date" {...register("fechaInauguracion")} />
        </Field>
      </div>

      <div className="grid-2">
        <Field label="Superficie" error={errors.superficie?.message}>
          <select {...register("superficie")}>
            {SUPERFICIES.map((s) => <option key={s} value={s}>{SUPERFICIE_LABEL[s]}</option>)}
          </select>
        </Field>
        <Field label="Paredes" error={errors.paredes?.message}>
          <select {...register("paredes")}>
            {PAREDES.map((p) => <option key={p} value={p}>{PAREDES_LABEL[p]}</option>)}
          </select>
        </Field>
      </div>

      <label className="check">
        <input type="checkbox" {...register("techada")} /> Cancha techada
      </label>

      {errors.root && <p className="alert">{errors.root.message}</p>}

      <button className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className={`field ${error ? "has-error" : ""}`}>
      <span>{label}</span>
      {children}
      {error && <small className="error">{error}</small>}
    </label>
  );
}
