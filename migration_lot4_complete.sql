-- ================================================================
-- MIGRATION LOT 4 — Stripe + Protocole remise clés + Reviews
-- À exécuter dans : Supabase SQL Editor
-- Idempotente : peut être ré-exécutée sans risque
-- ================================================================

-- ---------- 1. Enum protocole remise des clés ----------
DO $$ BEGIN
  CREATE TYPE public.key_handover_protocol_type AS ENUM (
    'in_person',         -- Remise en main propre
    'lockbox',           -- Boîte à clés sécurisée
    'neighbor',          -- Voisin / concierge / gardien
    'already_provided'   -- Double déjà fourni
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- 2. Colonnes Stripe + clés sur bookings ----------
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT,
  ADD COLUMN IF NOT EXISTS platform_fee_amount NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS walker_amount NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS funds_released_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS key_handover_protocol public.key_handover_protocol_type,
  ADD COLUMN IF NOT EXISTS key_handover_details TEXT,
  ADD COLUMN IF NOT EXISTS key_handover_returned_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_bookings_stripe_pi ON public.bookings(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);

-- ---------- 3. Colonnes Stripe Connect sur profiles ----------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT FALSE;

-- ---------- 4. Type de review réciproque ----------
DO $$ BEGIN
  CREATE TYPE public.review_type_enum AS ENUM (
    'owner_to_walker',
    'walker_to_owner'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS review_type public.review_type_enum DEFAULT 'owner_to_walker';

-- ---------- 5. Trigger libération SOS auto (24h après end_proof) ----------
CREATE OR REPLACE FUNCTION public.trigger_sos_release()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si end_proof_url vient d'être posée et que les fonds ne sont pas encore libérés,
  -- on programme la libération via un flag (le cron Edge Function se chargera de la libération réelle)
  IF NEW.end_proof_url IS NOT NULL
     AND OLD.end_proof_url IS NULL
     AND NEW.funds_released_at IS NULL THEN
    NEW.payment_status := 'pending_release';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_sos_release_trigger ON public.bookings;
CREATE TRIGGER bookings_sos_release_trigger
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_sos_release();

-- ---------- 6. Vérification finale ----------
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'bookings'
    AND column_name IN (
      'stripe_payment_intent_id', 'platform_fee_amount', 'walker_amount',
      'funds_released_at', 'key_handover_protocol', 'key_handover_details'
    );
  RAISE NOTICE 'Colonnes LOT 4 présentes sur bookings: % / 6', v_count;
END $$;
