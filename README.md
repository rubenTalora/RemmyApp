# 👵 RemmyApp

**RemmyApp** es una plataforma diseñada para facilitar la búsqueda, gestión y comparación de centros de cuidados y residencias para personas mayores. Este repositorio contiene el panel de administración (**RemmyAdmin**) y la infraestructura de backend basada en **Supabase**.

## 🌳 Gestión de Ramas

Para evitar confusiones al retomar el proyecto, ten en cuenta la siguiente organización de ramas:

- **`main` / `frontend-developing` (ACTUAL):** Contiene la versión más reciente del proyecto (Vue 3 + Supabase). Es la rama de trabajo recomendada.
- **`backend-developing` / `CRUD` / `developing` (OBSOLETO):** Contienen el antiguo backend en Spring Boot. Estas ramas se mantienen solo por motivos históricos y no deben utilizarse.
- **`vibecodeada-padre` (HISTÓRICO):** Contiene prototipos iniciales y recursos visuales (capturas en `stitch-downloads`).

---

## 🧠 Decisiones de Diseño y "Gotchas"

Para los nuevos desarrolladores, aquí hay algunas decisiones arquitectónicas clave tomadas durante el desarrollo:

- **Geolocalización Híbrida:** Las direcciones almacenan coordenadas en dos formatos: columnas `float` (`latitude`, `longitude`) para lectura fácil desde JS/TS, y un campo `geo_location` (PostGIS) para consultas espaciales. Existe un **Trigger en la DB** (`sync_geo_location`) que mantiene ambos sincronizados automáticamente. No es necesario calcular el punto geográfico en el frontend.
- **Buscador de Direcciones Offline-first:** El sistema de códigos postales (`POSTAL_CODES`, `CITIES`, etc.) está diseñado para permitir que el administrador seleccione una dirección válida de España sin realizar llamadas a APIs externas de geocodificación (ahorro de costes y mayor velocidad).
- **Tipado Estricto:** Se ha priorizado el uso de `database.types.ts`. Si una consulta a Supabase no parece tener los campos correctos, lo más probable es que falte actualizar los tipos tras una migración.
- **Edge Functions para Admins:** La lógica de invitar o revocar administradores no se hace directamente en la tabla de perfiles, sino a través de **Edge Functions** para garantizar que solo un SuperAdmin pueda realizar estas operaciones críticas mediante la API de administración de Supabase.

---

## 🚀 Arquitectura del Proyecto

El proyecto ha evolucionado hacia una arquitectura moderna de **Frontend-as-a-Service**:

- **Frontend (Admin):** Desarrollado con **Vue 3 (Vite)**, **Tailwind CSS 4** y **Pinia**. Se encuentra en la carpeta `frontend/RemmyAdmin`.
- **Backend (BaaS):** Gestión integral con **Supabase**, que incluye:
  - **Base de Datos:** PostgreSQL con soporte para geolocalización (PostGIS).
  - **Autenticación:** Sistema de usuarios y roles (Admin/SuperAdmin).
  - **Edge Functions:** Lógica de servidor para invitaciones de administradores.
  - **Storage:** Almacenamiento de imágenes de los centros.

## 📂 Estructura de Carpetas

```text
/
├── frontend/RemmyAdmin/    # Aplicación principal de administración
│   ├── src/                # Código fuente (Vue, Pinia, Router)
│   ├── supabase/           # Migraciones y Edge Functions
│   └── scripts/            # Scripts de utilidad (seeding de datos)
└── .atl/                   # Registro de habilidades de IA (uso interno)
```

## 🛠️ Requisitos Previos

- **Node.js:** Versión 20 o superior (recomendado v22+).
- **PNPM:** Gestor de paquetes recomendado.
- **Supabase CLI:** Para gestionar las migraciones y funciones locales.

## 🏁 Cómo empezar

Para instrucciones detalladas sobre cómo arrancar el panel de administración y configurar la base de datos, consulta el manual en:
👉 [**Guía de Inicio de RemmyAdmin**](./frontend/RemmyAdmin/README.md)

---

*Proyecto desarrollado para facilitar la transición a un nuevo equipo de desarrollo.*
