# 📋 Cahier des Charges — Suivi d'avancement

> Statuts : ✅ Fait · 🟡 En cours · ⏳ À faire · ❌ Hors périmètre

---

## LOT 1 — SEO, Lexique, Navigation

| Point | Statut | Détail |
|---|---|---|
| Slugs FR + redirects 301 | ✅ | `/services/garde-domicile`, `/services/marche-reguliere`, etc. |
| Purge lexique interdit (Rover, pet-sitter, assurance externe) | ✅ | Pages services, demoData, headers, alt SEO |
| Header : "Trouver un Accompagnateur" + "Nos zones" | ✅ | `header.tsx` |
| H1 accueil aligné CDC | ✅ | "Trouvez l'Accompagnateur Certifié Idéal" |
| Page Tarifs : 15/85% + Code Unique | ✅ | `Tarifs.tsx` |
| Mention "À partir de…" sur pages services | ✅ | Toutes pages |
| Vocabulaire **Accompagnateur Certifié** | ✅ | Global |

---

## LOT 2 — Outil GO (Code Unique)

| Point | Statut | Détail |
|---|---|---|
| Migration colonnes `validation_code`, `started_at`, `funds_released_at`, `sos_*` | ✅ | Migration `20260418142443` |
| Génération auto code 6 chiffres | ✅ | Trigger `set_booking_validation_code` |
| Affichage code Propriétaire | ✅ | `ValidationCodeCard.tsx` |
| Saisie code Accompagnateur (OTP 6 cases) | ✅ | `ValidateCodeInput.tsx` |
| RPC `validate_booking_code` | ✅ | + libère funds + status=completed |
| Bouton SOS Propriétaire | ✅ | `SOSReleaseDialog.tsx` + RPC `trigger_sos_release` |
| Photo de prise en charge obligatoire (UI) | ✅ | `MissionStartButton` gère `start_proof_required` |
| Photo de prise en charge obligatoire (DB) | 🟡 | Trigger prêt — migration finale à appliquer |
| Horodatage `started_at` automatique | 🟡 | Posé par le trigger une fois la migration appliquée |

---

## LOT 3 — Sécurité & Anti-fraude

| Point | Statut | Détail |
|---|---|---|
| Rôles via `user_roles` + `has_role()` | ✅ | Conforme |
| Messagerie pré-paiement restreinte | ✅ | `useMessageGuard.ts` |
| Casier judiciaire retiré (CNI seule obligatoire) | ✅ | `DocumentUpload`, `VerificationBanner`, FAQ, README |
| Anonymisation téléphone hors fenêtre mission (UI) | ✅ | `BookingContactCard` |
| Anonymisation téléphone (RPC `get_booking_contact`) | 🟡 | Migration finale à appliquer |
| Trigger anti-annulation < 3h (UX) | ✅ | `CancelBookingDialog` (alerte + bouton désactivé) |
| Trigger anti-annulation < 3h (DB) | 🟡 | Migration finale à appliquer |
| Vue `bookings_walker_safe` | 🟡 | Migration finale à appliquer |
| Audit RLS automatique | ✅ | **0 finding** au scan sécurité Lovable |
| Interface admin validation CNI + motif refus | ✅ | `AdminDashboard.tsx` |

---

## LOT 4 — Stripe Connect & Séquestre réel

| Point | Statut |
|---|---|
| Onboarding Stripe Connect Express | ⏳ Non démarré (sur ta demande) |
| Capture séquestre 100% | ⏳ |
| Split 85% walker / 15% plateforme | ⏳ |
| Transferts auto après code GO | ⏳ |
| Webhooks Stripe → `funds_released_at` | ⏳ |

---

## ⚠️ Action requise — Migration SQL finale

Le code applicatif est **prêt et compile sans erreur** (TS ✅, scan sécurité ✅).
Pour activer **3 dernières sécurités côté base** (vue safe walker, anti-annulation 3h DB, photo départ obligatoire DB, RPC téléphone masqué), il faut appliquer le SQL ci-dessous.

👉 **À ta demande**, je relance la proposition de migration via l'outil officiel — réponds "applique la migration" et je la pousse.

```sql
-- 1. Vue safe (walker ne voit jamais validation_code)
CREATE OR REPLACE VIEW public.bookings_walker_safe AS
SELECT id, owner_id, walker_id, dog_id, booking_date, start_time,
       duration_minutes, total_price, status, notes, address,
       created_at, updated_at, started_at, funds_released_at,
       validation_code_used_at, sos_triggered_at
FROM public.bookings;
GRANT SELECT ON public.bookings_walker_safe TO authenticated;

-- 2. Anti-annulation < 3h
CREATE OR REPLACE FUNCTION public.prevent_late_cancellation() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE _scheduled timestamptz; _hours numeric;
BEGIN
  IF NEW.status='cancelled' AND OLD.status<>'cancelled' THEN
    BEGIN _scheduled:=(NEW.booking_date::text||' '||COALESCE(NEW.start_time::text,'00:00:00'))::timestamptz;
    EXCEPTION WHEN OTHERS THEN _scheduled:=NEW.booking_date::timestamptz; END;
    _hours:=EXTRACT(EPOCH FROM (_scheduled-now()))/3600.0;
    IF _hours<3 AND _hours>-1 AND NOT public.has_role(auth.uid(),'admin'::app_role) THEN
      RAISE EXCEPTION 'cancellation_too_late' USING ERRCODE='P0001';
    END IF;
  END IF; RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_prevent_late_cancellation ON public.bookings;
CREATE TRIGGER trg_prevent_late_cancellation BEFORE UPDATE OF status ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.prevent_late_cancellation();

-- 3. Photo départ obligatoire
CREATE OR REPLACE FUNCTION public.require_start_proof() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _has boolean;
BEGIN
  IF NEW.status='in_progress' AND OLD.status<>'in_progress' THEN
    SELECT EXISTS(SELECT 1 FROM public.walk_proofs WHERE booking_id=NEW.id AND photo_type='start') INTO _has;
    IF NOT _has THEN RAISE EXCEPTION 'start_proof_required' USING ERRCODE='P0001'; END IF;
    NEW.started_at:=COALESCE(NEW.started_at,now());
  END IF; RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_require_start_proof ON public.bookings;
CREATE TRIGGER trg_require_start_proof BEFORE UPDATE OF status ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.require_start_proof();

-- 4. RPC contact (téléphone visible 24h avant uniquement)
CREATE OR REPLACE FUNCTION public.get_booking_contact(_booking_id uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _b public.bookings; _u uuid:=auth.uid(); _sched timestamptz; _h numeric;
        _phone text; _name text;
BEGIN
  IF _u IS NULL THEN RETURN jsonb_build_object('error','not_authenticated'); END IF;
  SELECT * INTO _b FROM public.bookings WHERE id=_booking_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('error','not_found'); END IF;
  IF _u NOT IN (_b.owner_id,_b.walker_id) THEN RETURN jsonb_build_object('error','not_authorized'); END IF;
  BEGIN _sched:=(_b.booking_date::text||' '||COALESCE(_b.start_time::text,'00:00:00'))::timestamptz;
  EXCEPTION WHEN OTHERS THEN _sched:=_b.booking_date::timestamptz; END;
  _h:=EXTRACT(EPOCH FROM (_sched-now()))/3600.0;
  IF _b.status NOT IN ('confirmed','in_progress') OR _h>24 THEN
    RETURN jsonb_build_object('phone_visible',false,
      'reason',CASE WHEN _h>24 THEN 'too_early' ELSE 'wrong_status' END);
  END IF;
  IF _u=_b.owner_id THEN SELECT phone,first_name INTO _phone,_name FROM public.profiles WHERE id=_b.walker_id;
  ELSE SELECT phone,first_name INTO _phone,_name FROM public.profiles WHERE id=_b.owner_id; END IF;
  RETURN jsonb_build_object('phone_visible',true,'phone',_phone,'name',_name);
END; $$;
GRANT EXECUTE ON FUNCTION public.get_booking_contact(uuid) TO authenticated;

-- 5. Index perf
CREATE INDEX IF NOT EXISTS idx_walk_proofs_booking_type
  ON public.walk_proofs(booking_id, photo_type);
```
