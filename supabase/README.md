# RemmyApp — Supabase Setup

Instrucciones para reproducir la base de datos en una cuenta nueva de Supabase y contexto de desarrollo para el equipo que retome el proyecto.

---

## Estructura del monorepo

```
RemmyApp/
├── frontend/
│   ├── RemmyAdmin/        ← panel web de administración (Vue 3 + TypeScript)
│   └── appMovil/          ← app móvil (pendiente)
└── supabase/              ← fuente de verdad única de infraestructura
    ├── config.toml
    ├── seed-superadmin.sql
    ├── functions/
    │   ├── invite-admin/
    │   ├── list-admins/
    │   └── revoke-admin/
    └── migrations/
        ├── 20260324182606_fix_centers_schema.sql
        ├── 20260324182619_geolocation.sql
        ├── 20260324182630_postal_codes_cache.sql
        ├── 20260324184437_rls_policies_authenticated.sql
        ├── 20260324185938_refresh_postal_code_lookup_rpc.sql
        ├── 20260324194353_add_city_to_addresses.sql
        └── 20260325_001_create_profiles.sql   ← pendiente de aplicar
```

---

## 1. Crear el proyecto en Supabase

1. Crear una cuenta en [supabase.com](https://supabase.com) y crear un nuevo proyecto.
2. Anotar: **Project URL**, **anon key** y **service role key** (Settings → API).
3. Habilitar la extensión PostGIS: `Database → Extensions → postgis → Enable`.
   Sin PostGIS, las migraciones de geolocalización fallan.

---

## 2. Instalar Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Linux / Windows (npm)
npm install -g supabase
```

Verificar instalación:

```bash
supabase --version
```

---

## 3. Vincular el proyecto

Desde la raíz del monorepo:

```bash
supabase login
supabase link --project-ref <tu-project-ref>
```

El `project-ref` es el identificador que aparece en la URL del dashboard: `app.supabase.com/project/<project-ref>`.

---

## 4. Aplicar las migraciones

```bash
supabase db push
```

Esto aplica los 7 archivos de `supabase/migrations/` en orden. El resultado esperado:

| Migración | Qué hace |
|-----------|----------|
| `20260324182606_fix_centers_schema` | Añade `name`, `email`, `website` a CENTERS; normaliza CENTER_CHARACTERISTICS; arregla tipo de PHONES |
| `20260324182619_geolocation` | Añade `latitude`/`longitude` a ADDRESSES; trigger que sincroniza → `geo_location` PostGIS; seed de comunidades autónomas |
| `20260324182630_postal_codes_cache` | Tabla POSTAL_CODES; materialized view `postal_code_lookup` para resolución offline de CP → ciudad → provincia |
| `20260324184437_rls_policies_authenticated` | RLS en todas las tablas públicas: solo rol `authenticated` puede operar |
| `20260324185938_refresh_postal_code_lookup_rpc` | Función `refresh_postal_code_lookup()` para refrescar la view desde el frontend sin privilegios de superusuario |
| `20260324194353_add_city_to_addresses` | Columna `city TEXT` en ADDRESSES para mostrar sin joins |
| `20260325_001_create_profiles` | Tabla `profiles` con roles (`admin`/`superadmin`), trigger auto-creación, RLS, bucket `avatars` en Storage |

> **Nota sobre `001_create_profiles`**: esta migración aún no estaba aplicada en producción cuando se aparcó el proyecto. Está lista y es correcta — es parte del ciclo `settings-admin` que quedó pendiente de implementar en el frontend.

---

## 5. Promover el primer superadmin

Después de que el primer usuario se registre (o sea invitado), ejecutar en el SQL Editor del dashboard:

```sql
-- Reemplazar con el email real
UPDATE profiles
SET role = 'superadmin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'tu@email.com'
);
```

El archivo `supabase/seed-superadmin.sql` contiene este mismo script como referencia.

> Sin este paso no hay ningún superadmin activo y la gestión de admins desde el panel no funciona.

---

## 6. Desplegar las Edge Functions

```bash
supabase functions deploy invite-admin
supabase functions deploy list-admins
supabase functions deploy revoke-admin
```

O todo de una:

```bash
supabase functions deploy
```

Las tres funciones requieren el `SUPABASE_SERVICE_ROLE_KEY` disponible como variable de entorno en el runtime de las Edge Functions. Supabase lo inyecta automáticamente — no hace falta configurarlo manualmente.

---

## 7. Variables de entorno del frontend

Crear `frontend/RemmyAdmin/.env.local` con:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_MAPBOX_TOKEN=<mapbox-token>
```

> El token de Mapbox es necesario para el autocompletado de direcciones en el formulario de centros. Si no se tiene, el campo de dirección no funcionará pero la app arranca.

---

## 8. Cargar datos geográficos (opcional pero recomendado)

La materialized view `postal_code_lookup` permite resolver código postal → ciudad → provincia sin llamar a Mapbox. Para que funcione hay que importar el dataset de España.

Fuente gratuita (dominio público): [https://download.geonames.org/export/zip/ES.zip](https://download.geonames.org/export/zip/ES.zip)

Columnas relevantes del archivo: `postal_code`, `place_name`, `admin_name1` (comunidad), `admin_name2` (provincia).

El script de carga está pendiente de crear en `scripts/seed_postal_codes.ts`. Después de importar:

```sql
SELECT refresh_postal_code_lookup();
```

---

## Estado del proyecto al aparcar

### Lo que está funcional

- Autenticación completa (login, sesión persistente, logout, guard de rutas)
- CRUD de centros de asistencia humanitaria
- Formulario de creación de centros con todos los sub-formularios (dirección, teléfonos, redes sociales, características, mapa)
- Autocompletado de direcciones con Mapbox Geocoding API
- Geolocalización: las coordenadas se sincronizan automáticamente a `geo_location` (PostGIS) via trigger
- UI completa con identidad visual corporativa (Forest Green, DM Sans, Lucide icons)
- Panel de gestión con búsqueda y paginación

### Deuda técnica conocida

**TypeScript — errores pre-existentes** (no bloquean el build de Vite pero sí `npm run type-check`):

| Archivo | Error |
|---------|-------|
| `src/features/Centers/components/createCenter/Email.vue` | TS2345: `string\|number` no asignable a `number` |
| `src/features/Centers/components/createCenter/Phone.vue` | TS2345: mismo problema |
| `src/features/Centers/composables/usePostalCodeLookup.ts` | TS2339: propiedad no existe en tipo `never` (×6) |
| `src/features/Centers/stores/addresses.ts` | TS2769: payload no asignable a `never` |
| `src/features/Centers/stores/centers.ts` | TS2769/TS2345: payload issues (×2) |
| `src/features/Centers/stores/phones.ts` | TS2769: insert payload |

El origen es que `database.types.ts` no está regenerado con el esquema actual — los tipos de Supabase no coinciden con la BD real. Solución: regenerar tipos con `supabase gen types typescript --project-id <ref> > src/lib/database.types.ts`.

**`registerForm.vue`**: usa `color: var(--primary)` en un estilo scoped. La variable `--primary` fue eliminada del sistema de diseño. El enlace "¿Olvidaste tu contraseña?" se renderiza en color heredado (negro). Impacto visual bajo.

**`infoCenterView.vue`**: las secciones de Características y Redes Sociales están definidas en el `<script>` pero no renderizadas en el `<template>`. Los datos existen, la UI está ausente.

---

## Trabajo pendiente — ciclo `settings-admin`

Este era el próximo bloque de trabajo cuando se aparcó el proyecto. La migración de BD ya está incluida (`20260325_001_create_profiles.sql`) y las Edge Functions ya están desplegadas. Lo que falta es **todo el frontend**.

### Resumen

Gestión de perfil de usuario y gestión de administradores desde el panel.

### Componentes a crear

```
src/features/Settings/
├── views/
│   ├── ProfileView.vue
│   └── AdminsView.vue
├── components/
│   ├── settings/SettingsSidebar.vue
│   ├── profile/
│   │   ├── AvatarUpload.vue
│   │   ├── ProfileForm.vue
│   │   └── ChangePasswordForm.vue
│   └── admins/
│       ├── AdminsTable.vue
│       ├── InviteAdminModal.vue
│       └── RevokeAdminButton.vue
├── stores/
│   ├── profile.ts
│   └── admins.ts
├── composables/
│   └── useAvatarUpload.ts
└── entities/
    └── admin.ts
```

### Archivos existentes a modificar

| Archivo | Cambio |
|---------|--------|
| `src/features/Auth/stores/auth.ts` | Llamar `profileStore.loadProfile(user.id)` tras `getSession()` y tras `signIn`; añadir computed `role` |
| `src/app/router/index.ts` | Añadir rutas `/settings/profile` y `/settings/admins`; extender `beforeEach` con guard de rol |
| `src/shared/sideBar/components/sideBar.vue` | Actualizar link de Configuración a `/settings/profile`; mostrar "Gestión de Admins" solo si `role === 'superadmin'` |
| `src/lib/database.types.ts` | Añadir tipos de la tabla `profiles` |

### Decisiones de arquitectura ya tomadas

- **Roles**: solo `admin` y `superadmin`. El rol vive en `public.profiles`, no en `user_metadata` (que es writable por el usuario y no es de confianza).
- **Gestión de admins**: siempre a través de Edge Functions con service role key. La anon key nunca accede a `auth.users`.
- **Email**: read-only en el perfil. Cambiarlo implicaría flujo de confirmación — no implementado.
- **Avatar**: bucket `avatars` público. Path `{userId}/avatar.{ext}`. Sin signed URLs.
- **Revoke**: la Edge Function borra el auth user pero mantiene el row en `profiles` intencionalmente para auditoría.
- **Bootstrap del primer superadmin**: problema de gallina-huevo sin solución desde la UI. Se hace via SQL (ver paso 5 de este README).

### Advertencia de RLS en `profiles`

La política `select_all_superadmin` hace una subquery sobre la misma tabla `profiles` para verificar el rol del caller. En producción con muchos usuarios esto puede crear una query recursiva. Si aparecen problemas de rendimiento, la solución es cachear el rol en los JWT claims usando un Supabase Auth Hook — no está implementado.

### Para arrancar

```bash
# En la raíz del monorepo, con el proyecto vinculado
supabase db push   # aplica 20260325_001_create_profiles si no está aplicada

# Regenerar tipos TypeScript
supabase gen types typescript --project-id <ref> > frontend/RemmyAdmin/src/lib/database.types.ts

# Arrancar el frontend
cd frontend/RemmyAdmin
pnpm install
pnpm dev
```

Luego seguir el task breakdown completo en `sdd/settings-admin/tasks` (guardado en Engram — preguntar al agente por `sdd/settings-admin/tasks`).
