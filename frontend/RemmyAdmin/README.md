# 🛠️ RemmyAdmin - Panel de Control

Este es el panel de administración de **RemmyApp**, construido con las últimas tecnologías web para ofrecer una gestión fluida y eficiente de centros de mayores.

## 🏗️ Stack Tecnológico

- **Framework:** [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool:** [Vite 6](https://vite.dev/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/) (Rendimiento optimizado)
- **Estado:** [Pinia](https://pinia.vuejs.org/)
- **Backend/Auth:** [Supabase](https://supabase.com/)
- **Mapas:** [Leaflet](https://leafletjs.com/) (para geolocalización de centros)

## 🚦 Guía de Inicio Rápido

### 1. Instalación de dependencias
Se recomienda usar `pnpm` para una gestión de paquetes más rápida:
```bash
pnpm install
```

### 2. Configuración de Variables de Entorno
Copia el archivo de ejemplo y rellena los valores con los de tu proyecto de Supabase:
```bash
cp .env.example .env.local
```
> **Nota:** Para los scripts de seeding, necesitarás la `SUPABASE_SERVICE_ROLE_KEY`. **Nunca** la expongas en el código del frontend.

### 3. Base de Datos y Supabase
Asegúrate de tener instalada la [Supabase CLI](https://supabase.com/docs/guides/cli).

1. **Inicializar y aplicar migraciones:**
   ```bash
   supabase link --project-ref tu-id-de-proyecto
   supabase db push
   ```
2. **Desplegar Edge Functions:**
   ```bash
   supabase functions deploy invite-admin
   supabase functions deploy list-admins
   supabase functions deploy revoke-admin
   ```

### 4. Seeding de Datos (Crítico)
Para que el buscador de direcciones funcione, necesitas cargar los códigos postales de España:
```bash
node scripts/seed-postal-codes.mjs
```
*Este script descargará automáticamente los datos actualizados de Geonames (ES).*

## 📖 Arquitectura de Datos

El sistema de direcciones está altamente normalizado para garantizar la integridad de los datos:
- `COMMUNITIES` -> `PROVINCES` -> `CITIES` -> `POSTAL_CODES`
- Los centros (`CENTERS`) tienen una relación con `ADDRESSES`, que a su vez se vincula con un código postal y almacena la geolocalización (PostGIS).

## 🧬 Tipos de TypeScript (Supabase)

Para mantener la seguridad de tipos, este proyecto usa tipos generados automáticamente desde el esquema de Supabase. Si realizas cambios en la base de datos, puedes regenerar el archivo `src/lib/database.types.ts` ejecutando:

```bash
# Inicia sesión en Supabase si aún no lo has hecho
supabase login

# Genera los tipos
supabase gen types typescript --project-id tu-id-de-proyecto > src/lib/database.types.ts
```

## 🚀 Comandos disponibles

- `pnpm dev`: Arranca el servidor de desarrollo.
- `pnpm build`: Genera el build optimizado para producción.
- `pnpm type-check`: Ejecuta el chequeo de tipos de TypeScript.
- `pnpm lint`: Ejecuta el linter (Oxlint + ESLint) para mantener el código limpio.

---
*Documentación preparada para el relevo del equipo de RemmyApp.*
