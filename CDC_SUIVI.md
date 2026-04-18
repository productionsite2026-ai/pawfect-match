# 📋 Cahier des Charges — Suivi d'avancement

> Document de suivi mis à jour automatiquement à chaque itération.
> Statuts : ✅ Fait · 🟡 En cours · ⏳ À faire · ❌ Hors périmètre

---

## LOT 1 — SEO, Lexique, Navigation

| Point | Statut | Détail |
|---|---|---|
| Slugs FR services + redirects 301 | ✅ | `/services/garde-domicile`, `/services/marche-reguliere`, etc. déjà en place |
| Purge lexique interdit (Rover, pet-sitter, assurance externe) | ✅ | Nettoyé dans pages services, demoData, headers, alt SEO |
| Header : "Trouver un Accompagnateur" + "Nos zones" | ✅ | `header.tsx` |
| H1 accueil aligné CDC | ✅ | "Trouvez l'Accompagnateur Certifié Idéal pour votre Animal" |
| Page Tarifs : 15/85% + Code Unique mentionnés | ✅ | `Tarifs.tsx` |
| Mention "À partir de…" sur pages services | ✅ | Toutes les pages services |
| Vocabulaire **Accompagnateur Certifié** vs Promeneur | ✅ | Appliqué globalement |

---

## LOT 2 — Outil GO (Code Unique de Validation)

| Point | Statut | Détail |
|---|---|---|
| Migration colonnes `validation_code`, `started_at`, `funds_released_at`, `sos_*` | ✅ | Migration `20260418142443` appliquée |
| Génération auto code 6 chiffres à la confirmation | ✅ | Trigger `set_booking_validation_code` |
| Affichage code côté Propriétaire | ✅ | `ValidationCodeCard.tsx` |
| Saisie code côté Accompagnateur | ✅ | `ValidateCodeInput.tsx` (OTP 6 cases) |
| RPC `validate_booking_code` (sécurité walker_id) | ✅ | + libère funds + status=completed |
| Bouton SOS Propriétaire (mission injoignable) | ✅ | `SOSReleaseDialog.tsx` + RPC `trigger_sos_release` |
| Photo de prise en charge **obligatoire** avant in_progress | ✅ | Trigger DB `require_start_proof` + UI MissionStartButton |
| Horodatage `started_at` automatique | ✅ | Posé par trigger |
| Gestion erreur côté UI (`start_proof_required`) | ✅ | Message clair dans MissionStartButton |

⏳ **Reste à câbler côté infra** : application de la migration finale (vue safe + triggers + RPC contact). Voir bloc final.

---

## LOT 3 — Sécurité & Anti-fraude

| Point | Statut | Détail |
|---|---|---|
| Rôles via table `user_roles` + `has_role()` | ✅ | Pré-existant, conforme |
| Messagerie pré-paiement restreinte (PREWRITTEN_MESSAGES) | ✅ | `useMessageGuard.ts` dans `Messages.tsx` |
| Casier B3 obligatoire / RC Pro optionnelle | ✅ | `DocumentUpload.tsx`, `VerificationBanner.tsx` |
| Anonymisation téléphone hors fenêtre mission (RPC) | ✅ | `BookingContactCard.tsx` + `get_booking_contact()` |
| Trigger anti-annulation < 3h | ✅ | DB + UX `CancelBookingDialog` (bouton désactivé + alerte) |
| Vue `bookings_walker_safe` (sans validation_code) | ✅ | À utiliser côté listes walker — disponible |
| Audit RLS complet (toutes tables sensibles) | 🟡 | Bookings/walk_proofs OK ; à passer au scanner sécurité |
| Interface admin validation CNI/B3 + motif refus | ✅ | `AdminDashboard.tsx` — prompt motif obligatoire |

---

## LOT 4 — Stripe Connect & Séquestre réel

| Point | Statut |
|---|---|
| Onboarding Stripe Connect Express (Accompagnateurs) | ⏳ Lot 4 — non démarré (sur demande utilisateur) |
| Capture séquestre 100% client | ⏳ |
| Split 85% walker / 15% plateforme | ⏳ |
| Transferts automatiques après code GO | ⏳ |
| Webhooks Stripe → bookings.funds_released_at | ⏳ |

---

## ⚠️ Action requise — Migration finale à appliquer

Le SQL ci-dessous doit être appliqué pour activer **photo obligatoire + anti-annulation 3h + masquage téléphone** côté DB. Code applicatif déjà prêt.

Fichier prêt : `/tmp/migration.sql` (à appliquer via outil Supabase migrations).

Contenu :
1. Vue `bookings_walker_safe`
2. Trigger `prevent_late_cancellation` (< 3h)
3. Trigger `require_start_proof` (photo de départ obligatoire)
4. RPC `get_booking_contact` (téléphone visible 24h avant uniquement)
5. Index perf `idx_walk_proofs_booking_type`
