# 🎾 Canchas Rosario

Aplicación full stack para consultar **canchas de pádel** de Rosario y alrededores: precio por hora, superficie, tipo de paredes, si es techada y fecha de inauguración.

- Cualquier visitante puede ver el listado (con búsqueda, filtros, orden y paginación) y el detalle de cada cancha.
- Los usuarios se registran con email/contraseña o con GitHub (rol `user` por defecto, solo lectura).
- Los `admin` tienen un panel con el ABM de canchas y una página para cambiar el rol de otros usuarios.

**Stack:** Express 5 + TypeScript + MongoDB (Mongoose) · Better Auth (email/contraseña, GitHub, plugin `admin`) · React + Vite + TypeScript · React Hook Form + Zod · Deploy en Render.

## 🔗 Deploy

| | URL |
|---|---|
| Frontend (Static Site) | https://`<tu-frontend>`.onrender.com |
| Backend (Web Service) | https://`<tu-backend>`.onrender.com |

> El frontend llama siempre a `/api/...`; Render reescribe `/api/*` hacia el backend. Por eso las cookies de sesión quedan en el dominio del frontend.

## 👤 Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| admin | admin@canchas.com | `<completar>` |
| user | user@canchas.com | `<completar>` |

Se crean con `npm run seed` (ver más abajo).

## 🧱 Entidad: `Cancha`

| Campo | Tipo | Validación |
|---|---|---|
| `nombre` | texto | 3–80 caracteres |
| `club` | texto | 2–80 caracteres |
| `direccion` | texto | 5–120 caracteres |
| `precioPorHora` | número | > 0 |
| `techada` | booleano | default `false` |
| `superficie` | texto (enum) | `cesped-sintetico` \| `cemento` |
| `paredes` | texto (enum) | `blindex` \| `muro` |
| `fechaInauguracion` | fecha | fecha válida, no más de 1 año a futuro |
| `creadoPor` | texto | id del admin que la creó (automático) |
| `createdAt` / `updatedAt` | fecha | automáticos |

## 📡 Endpoints

| Método | Ruta | Rol requerido | Descripción |
|---|---|---|---|
| GET | `/api/canchas` | público | Listado. Query: `page`, `limit` (máx 50), `q`, `techada`, `superficie`, `orden` (`recientes`, `precio-asc`, `precio-desc`) |
| GET | `/api/canchas/:id` | público | Detalle (404 si no existe) |
| POST | `/api/canchas` | admin | Crear (201). 400 si falla Zod |
| PUT | `/api/canchas/:id` | admin | Editar (parcial). 400 / 404 |
| PATCH | `/api/canchas/:id` | admin | Editar (parcial). 400 / 404 |
| DELETE | `/api/canchas/:id` | admin | Eliminar (204). 404 si no existe |
| GET | `/api/me` | logueado | Usuario de la sesión actual |
| GET | `/api/health` | público | Health check |
| * | `/api/auth/*` | — | Endpoints de Better Auth (sign-in, sign-up, sign-out, get-session, admin/set-role, admin/list-users…) |

**Códigos:** `201` creado · `204` eliminado · `400` validación (con `detalles: [{ campo, mensaje }]`) · `401` sin sesión · `403` sin rol admin · `404` no existe.

Ejemplo de error 400:

```json
{
  "error": "Datos inválidos",
  "detalles": [{ "campo": "precioPorHora", "mensaje": "El precio debe ser mayor a 0" }]
}
```

## 💻 Correr en local

Requisitos: Node 20.19+ y una base MongoDB (Atlas o local).

```bash
# 1. Backend
cd backend
cp .env.example .env        # completar los valores
npm install
npm run seed                # crea admin + user de prueba y canchas de ejemplo
npm run dev                 # http://localhost:3000

# 2. Frontend (otra terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173  (Vite hace proxy de /api → :3000)
```

### Variables de entorno (`backend/.env`)

| Variable | Descripción |
|---|---|
| `PORT` | Puerto (local 3000; Render lo setea solo) |
| `MONGODB_URI` | URI de MongoDB |
| `BETTER_AUTH_SECRET` | Secreto aleatorio (`npx @better-auth/cli secret` o `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | URL pública por la que entra el navegador → **la del frontend** (`http://localhost:5173` en local) |
| `FRONTEND_URL` | Origen del frontend (CORS + trustedOrigins) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | OAuth App de GitHub |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Opcional |
| `SEED_*` | Emails y contraseñas de los usuarios de prueba |

### GitHub OAuth (local)

En GitHub → Settings → Developer settings → OAuth Apps → *New OAuth App*:

- Homepage URL: `http://localhost:5173`
- Authorization callback URL: `http://localhost:5173/api/auth/callback/github`

## 🚀 Deploy en Render

### Backend → Web Service
- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Variables: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=https://<tu-frontend>.onrender.com`, `FRONTEND_URL=https://<tu-frontend>.onrender.com`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- En MongoDB Atlas → Network Access, permitir `0.0.0.0/0` (Render no tiene IP fija en el plan free).

### Frontend → Static Site
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- **Redirects/Rewrites** (en este orden):

| Source | Destination | Action |
|---|---|---|
| `/api/*` | `https://<tu-backend>.onrender.com/api/*` | Rewrite |
| `/*` | `/index.html` | Rewrite |

### GitHub OAuth (producción)
Crear **otra** OAuth App:
- Homepage URL: `https://<tu-frontend>.onrender.com`
- Callback URL: `https://<tu-frontend>.onrender.com/api/auth/callback/github`

> Alternativa: `render.yaml` en la raíz es un Blueprint con esta misma configuración.

## 🗂️ Estructura

```
backend/
  src/
    lib/          env, conexión a Mongo, configuración de Better Auth
    middlewares/  authMiddleware, requireRole, validateBody (Zod), errores
    models/       Cancha (Mongoose)
    schemas/      Schemas Zod de crear / editar / listar
    routes/       /api/canchas, /api/me
    scripts/      seed de usuarios y canchas
frontend/
  src/
    lib/          authClient (useSession), cliente de la API, tipos
    schemas/      Schemas Zod de formularios
    components/   Navbar, ProtectedRoute, CanchaForm, CanchaCard, Pagination…
    pages/        Home, Detalle, Login, Registro, Admin (ABM), Usuarios (roles), Sin permisos
```

## ✅ Opcionales implementados
- Paginación, búsqueda por texto, filtros (techada / superficie) y orden por precio.
- Página de admin para cambiar roles con `authClient.admin.setRole`.
- Login con Google (se activa completando `GOOGLE_*` en el backend y `VITE_ENABLE_GOOGLE=true` en el frontend).
