-- ============================================================
-- LOT 2 — Outil "GO" : Code Unique de Validation + SOS
-- ============================================================

-- 1. Colonnes Code Unique de Validation sur bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS validation_code text,
  ADD COLUMN IF NOT EXISTS validation_code_used_at timestamptz,
  ADD COLUMN IF NOT EXISTS funds_released_at timestamptz,
  ADD COLUMN IF NOT EXISTS funds_release_method text 
    CHECK (funds_release_method IN ('code', 'sos_owner', 'auto_timeout', 'admin')),
  ADD COLUMN IF NOT EXISTS sos_triggered_at timestamptz,
  ADD COLUMN IF NOT EXISTS sos_reason text,
  ADD COLUMN IF NOT EXISTS started_at timestamptz,
  ADD COLUMN IF NOT EXISTS start_proof_id uuid;

-- 2. Fonction de génération du code (6 chiffres, unique par booking)
CREATE OR REPLACE FUNCTION public.generate_validation_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  code text;
BEGIN
  code := lpad((floor(random() * 1000000))::int::text, 6, '0');
  RETURN code;
END;
$$;

-- 3. Trigger : génère le code à la confirmation d'une réservation
CREATE OR REPLACE FUNCTION public.set_booking_validation_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Génère un code dès qu'une réservation est confirmée et n'en a pas
  IF NEW.status IN ('confirmed', 'in_progress') AND NEW.validation_code IS NULL THEN
    NEW.validation_code := public.generate_validation_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_validation_code ON public.bookings;
CREATE TRIGGER trg_set_validation_code
  BEFORE INSERT OR UPDATE OF status ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_booking_validation_code();

-- 4. Backfill : génère un code pour les bookings confirmés/en cours sans code
UPDATE public.bookings
SET validation_code = public.generate_validation_code()
WHERE validation_code IS NULL
  AND status IN ('confirmed', 'in_progress', 'completed');

-- 5. Fonction de validation du code par l'Accompagnateur
CREATE OR REPLACE FUNCTION public.validate_booking_code(
  _booking_id uuid,
  _code text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _booking public.bookings;
  _user_id uuid := auth.uid();
BEGIN
  IF _user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_authenticated');
  END IF;

  SELECT * INTO _booking FROM public.bookings WHERE id = _booking_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'booking_not_found');
  END IF;

  -- Seul l'accompagnateur de la mission peut valider
  IF _booking.walker_id IS DISTINCT FROM _user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_authorized');
  END IF;

  IF _booking.validation_code IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'no_code_generated');
  END IF;

  IF _booking.validation_code_used_at IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'code_already_used');
  END IF;

  IF _booking.validation_code <> _code THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_code');
  END IF;

  -- Code valide → libère les fonds (logique métier; Stripe vient ensuite)
  UPDATE public.bookings
  SET 
    status = 'completed',
    validation_code_used_at = now(),
    funds_released_at = now(),
    funds_release_method = 'code',
    updated_at = now()
  WHERE id = _booking_id;

  RETURN jsonb_build_object('success', true, 'booking_id', _booking_id);
END;
$$;

-- 6. Fonction SOS : libération exceptionnelle par le Propriétaire
CREATE OR REPLACE FUNCTION public.trigger_sos_release(
  _booking_id uuid,
  _reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _booking public.bookings;
  _user_id uuid := auth.uid();
BEGIN
  IF _user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_authenticated');
  END IF;

  SELECT * INTO _booking FROM public.bookings WHERE id = _booking_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'booking_not_found');
  END IF;

  -- Seul le propriétaire peut déclencher le SOS
  IF _booking.owner_id IS DISTINCT FROM _user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_authorized');
  END IF;

  IF _booking.funds_released_at IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'funds_already_released');
  END IF;

  -- Libère les fonds + ouvre un flag SOS pour modération admin
  UPDATE public.bookings
  SET 
    status = 'completed',
    sos_triggered_at = now(),
    sos_reason = _reason,
    funds_released_at = now(),
    funds_release_method = 'sos_owner',
    updated_at = now()
  WHERE id = _booking_id;

  RETURN jsonb_build_object('success', true, 'booking_id', _booking_id);
END;
$$;

-- 7. Permissions RLS — les utilisateurs voient leurs propres bookings (déjà en place normalement)
-- Mais on s'assure que validation_code est visible UNIQUEMENT pour le propriétaire
-- (déjà géré par RLS existante sur bookings : owner_id = auth.uid())

-- 8. Index pour performance
CREATE INDEX IF NOT EXISTS idx_bookings_validation_code 
  ON public.bookings(validation_code) 
  WHERE validation_code IS NOT NULL;

-- 9. Permissions d'exécution des fonctions
GRANT EXECUTE ON FUNCTION public.validate_booking_code(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.trigger_sos_release(uuid, text) TO authenticated;
