# 🐕 DogWalking - Plateforme de Confiance Vérifiée (France)

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Connected-green.svg)](https://supabase.com/)

---

## 🚀 Vision & Architecture 2026

**DogWalking** est la plateforme n°1 en France pour l'accompagnement animalier sécurisé. Ce projet a été restructuré pour répondre aux exigences de sécurité les plus strictes du marché ("Confiance Vérifiée").

### Structure en Sous-domaines (Logique)
Le projet est conçu pour une séparation stricte des usages :
- **dogwalking.fr** : Site public marketing, SEO et informationnel.
- **app.dogwalking.fr** : Application utilisateur (Dashboards Propriétaires & Accompagnateurs).
- **admin.dogwalking.fr** : Interface de gestion, modération et validation interne.

---

## 🛡️ Protocoles de Sécurité DogWalking

### 1. Sélection Elite (Cible 35%)
Chaque Accompagnateur subit une vérification manuelle rigoureuse pour garantir un haut niveau de fiabilité :
- **CNI** : Vérification de la pièce d'identité.
- **Casier B2** : Vérification du casier judiciaire (B2) vierge.
- **Taux d'acceptation** : Seuls 35% des candidats sont retenus.

### 2. Système de Séquestre & Code Unique
- **Séquestre** : Les fonds sont bloqués lors de la réservation et sécurisés sur la plateforme.
- **Libération des fonds** : Uniquement possible via la saisie d'un **code unique** détenu par le Propriétaire et transmis à l'Accompagnateur à la fin de la mission.
- **Commission** : 15% (85% reversés à l'Accompagnateur).

### 3. Preuve Visuelle Obligatoire (Outil "GO")
L'outil "GO" remplace le GPS intrusif par un protocole de preuves concrètes :
- **Photo de départ** obligatoire pour démarrer le chronomètre.
- **Photos/Vidéos de preuve** envoyées en temps réel durant la mission.
- **Compte-rendu détaillé** obligatoire en fin de prestation.

---

## 📁 Architecture du Projet

```
src/
├── components/
│   ├── dashboard/             # Dashboards Propriétaire & Accompagnateur
│   │   └── shared/            # Outil "GO" (WalkManagementSheet.tsx)
│   ├── seo/                   # SEOHead optimisé pour dogwalking.fr
│   └── ui/                    # Composants UI (Header, Footer, Hero)
│
├── data/                      # Données structurées (servicesData.ts)
│
├── pages/
│   ├── AdminDashboard.tsx     # Interface admin.dogwalking.fr
│   ├── Support.tsx            # Pages À propos & Contact
│   ├── Tarifs.tsx             # Page Tarifs & Séquestre
│   └── Index.tsx              # Page d'accueil publique
│
└── docs/                      # Documentation officielle DogWalking
    ├── CAHIER_DES_CHARGES.md  # Référentiel fonctionnel
    └── CAHIER_DES_CHARGES_FINAL.docx
```

---

## 🛠️ Stack Technique

- **Frontend** : React + TypeScript + TailwindCSS + Framer Motion.
- **Backend/DB** : Supabase (Auth, Database, Storage).
- **UI Components** : Radix UI + Lucide Icons.

---

## 📄 Documentation Finale

Retrouvez toute la documentation fonctionnelle et technique dans le dossier `/docs`. Le projet est livré avec un **Cahier des Charges complet** certifié conforme aux demandes de restructuration.

---
*DogWalking – La sérénité pour vous, le bonheur pour eux.*
