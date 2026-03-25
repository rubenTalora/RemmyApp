-- =============================================================================
-- Migration: Create Profiles
-- Creates the profiles table, role enum, auto-create trigger, RLS policies,
-- and storage bucket for user avatars.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Enum de roles
-- ---------------------------------------------------------------------------
CREATE TYPE public.user_role AS ENUM ('admin', 'superadmin');

-- ---------------------------------------------------------------------------
-- 2. Tabla profiles
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name   text,
  avatar_url  text,
  role        public.user_role NOT NULL DEFAULT 'admin',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 3. Trigger: auto-crear profile al registrar usuario en auth.users
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'admin'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 4. RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Usuario puede leer su propio perfil
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Superadmin puede leer todos los perfiles
CREATE POLICY "profiles_select_all_superadmin"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- Usuario puede actualizar su propio perfil (solo full_name y avatar_url, NO role)
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Revocar privilegio UPDATE en columna role para rol authenticated
REVOKE UPDATE (role) ON public.profiles FROM authenticated;

-- ---------------------------------------------------------------------------
-- 5. Storage bucket para avatares
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: usuario puede subir/actualizar su propio avatar
CREATE POLICY "avatar_upload_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatar_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: lectura pública de avatares
CREATE POLICY "avatar_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
