# 📋 Cahier des Charges — Suivi d'avancement

> Statuts : ✅ Fait · 🟡 En cours · ⏳ À faire

---

## ✅ LOT 1 — SEO, Lexique, Navigation (100%)
- Slugs FR + redirects 301 (`/services/garde-domicile`, etc.)
- Lexique purgé (Rover, pet-sitter, assurance externe)
- Header : "Trouver un Accompagnateur" + "Nos zones"
- H1 accueil : "Trouvez l'Accompagnateur Certifié Idéal"
- Page Tarifs : 15/85% + Code Unique
- "À partir de…" sur toutes les pages services

## ✅ LOT 2 — Outil GO côté code (100%)
- `ValidationCodeCard.tsx` (affichage propriétaire)
- `ValidateCodeInput.tsx` (saisie OTP 6 cases walker)
- `SOSReleaseDialog.tsx` (clôture exceptionnelle)
- `MissionStartButton.tsx` gère erreur `start_proof_required`

## ✅ LOT 3 — Sécurité côté code (100%)
- Messagerie pré-paiement restreinte (`useMessageGuard.ts`)
- **Casier judiciaire totalement retiré** (CNI seule obligatoire)
- `BookingContactCard.tsx` (téléphone masqué hors fenêtre)
- `CancelBookingDialog.tsx` (alerte + bouton désactivé < 3h)
- AdminDashboard : motif obligatoire au refus CNI
- Scan sécurité Lovable : **0 finding**

---

## 🟡 ACTION REQUISE — Migration SQL à appliquer

**Constat lors de la vérification du dossier interne :**
La table `bookings` ne contient **aucune** des colonnes Outil GO (`validation_code`, `started_at`, `funds_released_at`, `sos_*`). La migration précédente n'a jamais été exécutée. Sans ce SQL, `ValidationCodeCard`, `ValidateCodeInput`, `SOSReleaseDialog`, le masquage tél et l'anti-annulation 3h **ne fonctionneront pas**.

**Fichier prêt à exécuter** : `/mnt/documents/migration_finale.sql` (168 lignes, ajusté aux vrais noms de colonnes : `scheduled_date`, `scheduled_time`, `price`).

Contenu :
1. Ajout colonnes Outil GO sur `bookings`
2. Trigger génération auto code 6 chiffres à la confirmation
3. RPC `validate_booking_code` (walker → libère funds + completed)
4. RPC `trigger_sos_release` (propriétaire SOS)
5. Vue `bookings_walker_safe` (sans `validation_code`)
6. Trigger anti-annulation < 3h
7. Trigger photo de départ obligatoire
8. RPC `get_booking_contact` (téléphone visible 24h avant)
9. Index perf

**Comment l'appliquer** :
- Ouvrir l'éditeur SQL Supabase de ton projet
- Copier-coller le contenu de `/mnt/documents/migration_finale.sql`
- Exécuter

OU me dire **"valide la migration"** pour que je la propose via le bouton de migration officiel (qui s'affiche dans le chat avec un bouton "Apply").

---

## ⏳ LOT 4 — Stripe Connect (non démarré, sur ta demande)
Onboarding Express, séquestre 100%, split 85/15, transferts auto au code GO, webhooks.
