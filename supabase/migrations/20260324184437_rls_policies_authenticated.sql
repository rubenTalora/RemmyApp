-- =============================================================================
-- Migration: RLS Policies — authenticated role
-- Recovered from production (was never committed to the repo).
--
-- Model:
--   - Catalog/lookup tables (read-only): SELECT for authenticated
--   - Transactional tables (full CRUD):  SELECT/INSERT/UPDATE/DELETE for authenticated
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Enable RLS on all public tables
-- ---------------------------------------------------------------------------
ALTER TABLE public."COMMUNITIES"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PROVINCES"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CITIES"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."LOCAL_ZONES"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."POSTAL_CODES"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ROAD_TYPES"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CENTER_TYPES"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CHARACTERISTIC_TYPES" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SOCIAL_MEDIA"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CENTERS"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ADDRESSES"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PHONES"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CENTER_CHARACTERISTICS" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CENTER_SOCIALMEDIA"   ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- Read-only catalog tables
-- ---------------------------------------------------------------------------
CREATE POLICY "authenticated can select COMMUNITIES"
  ON public."COMMUNITIES" FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated can select PROVINCES"
  ON public."PROVINCES" FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated can select CITIES"
  ON public."CITIES" FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated can select LOCAL_ZONES"
  ON public."LOCAL_ZONES" FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated can select POSTAL_CODES"
  ON public."POSTAL_CODES" FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated can select ROAD_TYPES"
  ON public."ROAD_TYPES" FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated can select CENTER_TYPES"
  ON public."CENTER_TYPES" FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated can select CHARACTERISTIC_TYPES"
  ON public."CHARACTERISTIC_TYPES" FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated can select SOCIAL_MEDIA"
  ON public."SOCIAL_MEDIA" FOR SELECT TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- Full CRUD — CENTERS
-- ---------------------------------------------------------------------------
CREATE POLICY "authenticated can select CENTERS"
  ON public."CENTERS" FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated can insert CENTERS"
  ON public."CENTERS" FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated can update CENTERS"
  ON public."CENTERS" FOR UPDATE TO authenticated USING (true);

CREATE POLICY "authenticated can delete CENTERS"
  ON public."CENTERS" FOR DELETE TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- Full CRUD — ADDRESSES
-- ---------------------------------------------------------------------------
CREATE POLICY "authenticated can select ADDRESSES"
  ON public."ADDRESSES" FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated can insert ADDRESSES"
  ON public."ADDRESSES" FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated can update ADDRESSES"
  ON public."ADDRESSES" FOR UPDATE TO authenticated USING (true);

CREATE POLICY "authenticated can delete ADDRESSES"
  ON public."ADDRESSES" FOR DELETE TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- Full CRUD — PHONES
-- ---------------------------------------------------------------------------
CREATE POLICY "authenticated can select PHONES"
  ON public."PHONES" FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated can insert PHONES"
  ON public."PHONES" FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated can update PHONES"
  ON public."PHONES" FOR UPDATE TO authenticated USING (true);

CREATE POLICY "authenticated can delete PHONES"
  ON public."PHONES" FOR DELETE TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- Full CRUD — CENTER_CHARACTERISTICS
-- ---------------------------------------------------------------------------
CREATE POLICY "authenticated can select CENTER_CHARACTERISTICS"
  ON public."CENTER_CHARACTERISTICS" FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated can insert CENTER_CHARACTERISTICS"
  ON public."CENTER_CHARACTERISTICS" FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated can update CENTER_CHARACTERISTICS"
  ON public."CENTER_CHARACTERISTICS" FOR UPDATE TO authenticated USING (true);

CREATE POLICY "authenticated can delete CENTER_CHARACTERISTICS"
  ON public."CENTER_CHARACTERISTICS" FOR DELETE TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- Full CRUD — CENTER_SOCIALMEDIA
-- ---------------------------------------------------------------------------
CREATE POLICY "authenticated can select CENTER_SOCIALMEDIA"
  ON public."CENTER_SOCIALMEDIA" FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated can insert CENTER_SOCIALMEDIA"
  ON public."CENTER_SOCIALMEDIA" FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated can update CENTER_SOCIALMEDIA"
  ON public."CENTER_SOCIALMEDIA" FOR UPDATE TO authenticated USING (true);

CREATE POLICY "authenticated can delete CENTER_SOCIALMEDIA"
  ON public."CENTER_SOCIALMEDIA" FOR DELETE TO authenticated USING (true);
