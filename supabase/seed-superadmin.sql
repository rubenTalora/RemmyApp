-- Bootstrap: promover usuario existente a superadmin
-- Ejecutar en Supabase Dashboard > SQL Editor
-- Reemplazar el email con el del admin a promover
--
-- IMPORTANTE: La tabla `profiles` aún no existe en la base de datos.
-- Este script debe ejecutarse DESPUÉS de aplicar la migración de settings-admin
-- (sdd/settings-admin), que es la que crea la tabla `profiles` con la columna `role`.

UPDATE profiles
SET role = 'superadmin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'TU_EMAIL_AQUI'
);
