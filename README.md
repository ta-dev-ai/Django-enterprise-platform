# RenovateEnergy - Plateforme de Rénovation Énergétique 🌿

> **Powered by Tayier OS Governance** - [Voir le Manifeste de l&#39;Orchestrateur](./PHILOSOPHY.md)

## 📋 Description

RenovateEnergy est une plateforme web Django dédiée à la visualisation et l'analyse des données de rénovation énergétique des bâtiments parisiens. Elle démontre l'application d'une **Architecture Hybride Humain/IA** rigoureuse.

## 🏗️ Architecture du Projet

### Structure des Dossiers

```
batiment-renovation-paris-monta - Copie/
├── batimentRenovation/          # Application Django principale (Vues & URLs root)
├── templates/                   # Source de vérité des Templates (Premium SPA)
│   ├── layouts/                 # Base Dashboard & Public
│   ├── pages/                   # Pages Consolidated (Overview, Batiment, DPE, Types)
│   └── components/              # Composants dynamiques
├── static/                      # Assets & Contrôleurs JavaScript (Centralized Store)
└── data/                        # Pipeline de données & API JSON
```

*Note : Le dossier `.ai_governance` contient le moteur de pilotage propriétaire et n'est pas documenté publiquement (Secret Industriel).*

## 🚀 Installation

### Prérequis

- Python 3.13+
- Django 6.0.1

### Démarrage Rapide

1. **Cloner et Installer**

```bash
pip install -r requirements.txt
python manage.py migrate
```

2. **Lancer le serveur**

```bash
python manage.py runserver 8000
```

## 🗺️ Plan du Site (URLs)

### 💻 Interface Utilisateur
- **Accueil** : `/`
- **Dashboard Global** : `/dashboard/`
- **Bâtiments Rénovés** : `/dashboard/batiment/`
- **Types de Travaux** : `/dashboard/types/`
- **Performance DPE** : `/dashboard/dpe/`
- **À Propos** : `/about/`
- **Contact** : `/contact/`
- **Administration** : `/admin_page/`

### 🔑 Authentification
- **Connexion** : `/login/`
- **Déconnexion** : `/logout/`
- **Django Admin** : `/admin/`

### 📡 API de Données (JSON)

#### 1. Endpoints Dynamiques (Analysis Service)
- **Classes Énergétiques** : `/api/energy-classes/`
- **Types de Rénovation** : `/api/Renovation-types/`
- **Bâtiments Stats** : `/api/Batiment_renovates/`

#### 2. Données Prétraitées (Dashboard V2)
Route générique : `/api/dashboard/<nom_fichier>/`

**Fichiers disponibles :**
- `tableau_recherche` : Données consolidées des bâtiments (Arrondissements)
- `tableau_types_travaux` : Statistiques détaillées par type de travaux
- `tableau_classes_dpe` : Répartition par classe énergétique (A-G)
- `table_market` : Indicateurs de marché
- `table_technical` : Données techniques détaillées
- `table_financial` : Indicateurs financiers

## 🌐 Fonctionnalités Clés

### Dashboard V2 (Architecture Isolée)

- **Isolation Contextuelle** : La sidebar s'adapte intelligemment à la vue (Bâtiment, Types, DPE).
- **Visualisation** : Graphiques ApexCharts interactifs avec toggle "Données/Graphique".
- **Performance** : Cache optimisé et chargement asynchrone via `apiFetch.js`.

### Design System (Neumorphism 2026)

- Interface utilisateur unifiée utilisant `var(--bg-pastel)`.
- Mode Sombre (Midnight Glass) natif.

## 📝 Licence & Propriété

Ce projet est une démonstration technique et méthodologique.
**Concept de Gouvernance IA** : © Tayierjiang Tayier 2026 - Tous droits réservés.

---

**Version:** 2.1.0 (Architecture Root Ready)
**Dernière mise à jour:** 02 Février 2026

