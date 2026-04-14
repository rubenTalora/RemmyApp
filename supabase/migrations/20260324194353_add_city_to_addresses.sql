-- =============================================================================
-- Migration: Add city column to ADDRESSES
-- Recovered from production (was never committed to the repo).
--
-- Stores the plain-text city name directly on the address row so the frontend
-- can display it without joining through LOCAL_ZONES → CITIES.
-- =============================================================================

ALTER TABLE public."ADDRESSES"
  ADD COLUMN IF NOT EXISTS city TEXT;
