-- =============================================================================
-- Migration: Refresh postal_code_lookup RPC
-- Recovered from production (was never committed to the repo).
--
-- Exposes a SECURITY DEFINER function so the app can refresh the materialized
-- view without needing superuser privileges.
-- Call: SELECT refresh_postal_code_lookup();
-- =============================================================================

CREATE OR REPLACE FUNCTION public.refresh_postal_code_lookup()
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY postal_code_lookup;
END;
$$;
