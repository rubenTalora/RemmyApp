-- =============================================================================
-- Migration: Geolocation — preparar ADDRESSES para lat/lng + Mapbox data
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. ADDRESSES: agregar lat/lng explícitos (además de geo_location geography)
--    Razón: el cliente JS de Supabase no serializa PostGIS automáticamente.
--    Guardamos lat/lng como floats para leer/escribir sin conversiones,
--    y mantenemos geo_location para queries espaciales futuras (ST_DWithin, etc.)
-- ---------------------------------------------------------------------------
ALTER TABLE "ADDRESSES"
  ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- ---------------------------------------------------------------------------
-- 2. ADDRESSES: guardar el place_id de Mapbox para evitar re-geocodificar
--    Si el admin edita el centro, podemos pre-cargar la dirección exacta.
-- ---------------------------------------------------------------------------
ALTER TABLE "ADDRESSES"
  ADD COLUMN IF NOT EXISTS mapbox_place_id TEXT;

-- ---------------------------------------------------------------------------
-- 3. Trigger: sync lat/lng → geo_location automáticamente al insertar/actualizar
--    Así las queries espaciales siempre tienen datos frescos sin trabajo extra
--    en el frontend.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION sync_geo_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.geo_location := ST_SetSRID(
      ST_MakePoint(NEW.longitude, NEW.latitude),
      4326
    )::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_geo_location ON "ADDRESSES";

CREATE TRIGGER trg_sync_geo_location
  BEFORE INSERT OR UPDATE ON "ADDRESSES"
  FOR EACH ROW
  EXECUTE FUNCTION sync_geo_location();

-- ---------------------------------------------------------------------------
-- 4. Índice espacial en geo_location (para búsquedas "centros cerca de mí")
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_addresses_geo_location
  ON "ADDRESSES" USING GIST (geo_location);

-- ---------------------------------------------------------------------------
-- 5. Poblar COMMUNITIES, PROVINCES y CITIES con datos reales de España
--    (seed básico — comunidades autónomas)
--    El frontend puede autocompletar desde estos datos cuando el admin
--    ingresa un código postal (lookup local, sin llamada a API).
-- ---------------------------------------------------------------------------
INSERT INTO "COMMUNITIES" (name) VALUES
  ('Andalucía'),
  ('Aragón'),
  ('Asturias'),
  ('Baleares'),
  ('Canarias'),
  ('Cantabria'),
  ('Castilla-La Mancha'),
  ('Castilla y León'),
  ('Cataluña'),
  ('Ceuta'),
  ('Comunidad de Madrid'),
  ('Comunidad Valenciana'),
  ('Extremadura'),
  ('Galicia'),
  ('La Rioja'),
  ('Melilla'),
  ('Murcia'),
  ('Navarra'),
  ('País Vasco')
ON CONFLICT DO NOTHING;
