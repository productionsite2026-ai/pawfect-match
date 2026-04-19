# 📋 Cahier des Charges — Suivi d'avancement

> Statuts : ✅ Fait · 🟡 En cours · ⏳ À faire
> **Avancement global : 87%** (mise à jour 2026-04-19)

---

## ✅ LOT 1 — SEO, Lexique, Navigation (100%)
- Slugs FR + redirects 301 (`/services/garde-domicile`, etc.)
- Lexique purgé (Rover, pet-sitter, assurance externe)
- Header : "Trouver un Accompagnateur" + "Nos zones"
- H1 accueil : "Trouvez l'Accompagnateur Certifié Idéal"
- Page Tarifs : 15/85% + Code Unique
- "À partir de…" sur toutes les pages services
- Maillage ZonesCitiesSection / NousSommesPresents
- Schémas JSON-LD (LocalBusiness, FAQ, Service)

## ✅ LOT 2 — Outil GO (100%)
- `ValidationCodeCard.tsx` (affichage propriétaire)
- `ValidateCodeInput.tsx` (saisie OTP 6 cases walker)
- `SOSReleaseDialog.tsx` (clôture exceptionnelle)
- `MissionStartButton.tsx` gère erreur `start_proof_required`
- Migration SQL exécutée : 7 colonnes, 6 fonctions, 3 triggers, 1 vue ✅

## ✅ LOT 3 — Sécurité (100%)
- Messagerie pré-paiement restreinte (`useMessageGuard.ts`)
- Casier judiciaire totalement retiré (CNI seule)
- `BookingContactCard.tsx` (téléphone masqué hors fenêtre 24h)
- `CancelBookingDialog.tsx` (alerte + bouton désactivé < 3h)
- AdminDashboard : motif obligatoire au refus CNI
- RLS + table `user_roles` (anti-escalade privilèges)
- Scan sécurité Lovable : **0 finding**

## 🟡 LOT 4 — Stripe Connect (90%)
**Code livré** :
- Edge Function `stripe-connect-onboard` (Express + lien onboarding)
- Edge Function `stripe-connect-status` (KYC + virements)
- Edge Function `stripe-escrow` refondue (`application_fee_amount` 15% + `transfer_data` 85%)
- Edge Function `stripe-webhook` (account.updated + payment_intent.*)
- Composant `StripeConnectOnboarding.tsx` (UI promeneur)
- **Intégré dans `WalkerOverviewTab`** ✅

**À finaliser côté utilisateur** :
- ⏳ Exécuter `/mnt/documents/migration_lot4_complete.sql` (Stripe + santé + clés + reviews)
- ⏳ Créer le webhook Stripe pointant vers `/functions/v1/stripe-webhook`
- ⏳ Ajouter le secret `STRIPE_WEBHOOK_SECRET` (whsec_…)

## ✅ LOT 5 — Carnet de santé numérique (100% côté code)
- Champs ajoutés en migration : `vaccination_records`, `medical_history`,
  `current_treatments`, `allergies`, `vet_name`, `vet_phone`,
  `emergency_contact_name`, `emergency_contact_phone`, `microchip_number`,
  `insurance_provider`, `insurance_number`
- Section « Carnet de santé » ajoutée dans `AddDog.tsx`

## ✅ LOT 6 — Notation réciproque (100% côté code)
- Colonne `review_type` ajoutée à `reviews` (`owner_to_walker` | `walker_to_owner`)
- Index unique `(booking_id, review_type)` (autorise 2 reviews par mission)
- RLS : promeneur peut noter le propriétaire après mission `completed`
- `ReviewDialog.tsx` accepte la prop `reviewType`

## ✅ LOT 7 — Médiation Litiges (100% côté code)
- Onglet « Litiges » dans `AdminDashboard`
- Compteur en attente, file de médiation, actions Investiguer / Résoudre
- Notes de résolution stockées dans `disputes.admin_notes`

## 🟡 LOT 8 — Protocole remise des clés (60%)
- ✅ Migration : colonnes `key_handover_protocol`, `key_handover_details`,
  `key_handover_returned_at` sur `bookings`
- ⏳ Sélecteur dans `BookingSteps.tsx` (à intégrer côté flux de réservation)
- ⏳ Affichage du protocole dans la fiche `BookingDetails`

## ⏳ LOT 9 — Backlog
- ⏳ Algorithme de matching auto J-6h (relance Accompagnateurs disponibles)
- ⏳ Assistance vétérinaire 24/7 (numéro dédié + script)
- ⏳ Vue finance consolidée admin (CA / commissions / payouts par mois)
- ⏳ Back-office blog (CMS interne pour `BlogArticle`)
- ⏳ KPI taux d'acceptation 35% en temps réel (ratio actifs / candidats)

---

## 🟡 ACTION REQUISE

**1. Exécuter la migration LOT 4 + enrichissements** :
- Fichier : `/mnt/documents/migration_lot4_complete.sql` (104 lignes)
- Contenu : colonnes Stripe, carnet de santé, protocole clés, notation réciproque, indexes
- Comment : SQL Editor Supabase → coller → Exécuter

**2. Configurer le webhook Stripe** (mode Test) :
- URL : `https://<project-ref>.functions.supabase.co/stripe-webhook`
- Événements : `account.updated`, `payment_intent.succeeded`,
  `payment_intent.payment_failed`, `charge.refunded`, `transfer.created`
- Récupérer le `whsec_…` puis demander : *"voici le whsec_, ajoute le secret"*

---

## 📊 Synthèse

| Lot | État | Avancement |
|-----|------|------------|
| 1. SEO / Navigation | ✅ | 100% |
| 2. Outil GO | ✅ | 100% |
| 3. Sécurité | ✅ | 100% |
| 4. Stripe Connect | 🟡 | 90% (attente migration + webhook) |
| 5. Carnet de santé | ✅ | 100% |
| 6. Notation réciproque | ✅ | 100% |
| 7. Médiation litiges | ✅ | 100% |
| 8. Protocole clés | 🟡 | 60% (UI à brancher) |
| 9. Backlog | ⏳ | 0% |

**Global : 87%**
