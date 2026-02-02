# RenovateEnergy - Desktop App 🌿

> **Powered by Tayier OS Governance** - [Voir le Manifeste de l&#39;Orchestrateur](./PHILOSOPHY.md)

Une application "One-Click" autonome pour la visualisation et l'analyse des données de rénovation énergétique des bâtiments parisiens. Ce projet démontre une **Architecture Hybride Humain/IA** avancée capable de transformer un projet Web Django complexe en une Application de Bureau portable.

---

## 🚀 Démarrage Instantané (Zéro Installation)

Ce projet a été conçu pour être **autonome**. Vous n'avez pas besoin d'installer Python ou de configurer des serveurs manuellement.

### 👉 Pour lancer l'application :

1. Téléchargez le projet (ou décompressez l'archive ZIP).
2. Double-cliquez sur le fichier **`DEMARRER.py`** à la racine.
3. C'est tout.

*Le système détectera automatiquement l'environnement, installera ou réparera les dépendances si nécessaire, et lancera le Dashboard dans votre navigateur.*

---

## 🏗️ Architecture du Projet

### Le Moteur "Hybrid Launcher"

L'application utilise une architecture unique combinant la puissance de **Django** (Backend) avec la flexibilité d'une interface de lancement en **PyQt6**.

| Composant          | Technologie     | Rôle                                                                                     |
| :----------------- | :-------------- | :---------------------------------------------------------------------------------------- |
| **Launcher** | PyQt6 / Python  | Interface de démarrage "Midnight Glass", gestion du processus serveur, auto-réparation. |
| **Backend**  | Django 6.0      | Traitement des données, API, Routing.                                                    |
| **Frontend** | HTML5 / CSS3    | Dashboard interactif, ApexCharts, Design System responsive.                               |
| **Portable** | venv (Embedded) | Environnement virtuel embarqué pour une portabilité totale.                             |

### Structure des Dossiers

```
PROJET_RENOVATE/
├── DEMARRER.py              <-- [POINT D'ENTRÉE] Script de démarrage intelligent
├── RenovateApp_Launcher/    <-- Le Cerveau de l'application bureau
│   ├── app_launcher.py      <-- Code source du lanceur
│   ├── ui/                  <-- Interface graphique du lanceur (HTML/CSS)
│   └── engine/              <-- Moteur Python portable (inclus dans les Releases)
├── batimentRenovation/      <-- Cœur du projet Django
├── templates/               <-- Vues HTML
├── static/                  # Assets (CSS, JS, Images)
└── data/                    # Pipeline de données JSON
```

---

## ✨ Fonctionnalités Clés

### 1. Mode "Portable & Self-Healing"

Le fichier `DEMARRER.py` contient une intelligence de maintenance :

* Il vérifie si l'environnement portable (`engine/venv`) est intègre.
* Si le dossier a été déplacé ou corrompu, il bascule automatiquement en **Mode Système** et réinstalle les dépendances manquantes en quelques secondes.

### 2. Dashboard Premium

* **Vues** : Bâtiments, DPE, Types de travaux.
* **Charts** : Graphiques interactifs ApexCharts.
* **Design** : Thème "Midnight Glass" unifié entre le lanceur et le site web.

### 3. API & Données

Le projet expose une API JSON complète pour l'alimentation du dashboard :

* `/api/energy-classes/`
* `/api/dashboard/tableau_recherche/` (Données consolidées)

---

## 📝 Licence & Propriété

Ce projet est une démonstration technique et méthodologique réalisée dans un cadre académique.

**Concept de Gouvernance IA & Launcher** : © Tayierjiang Tayier 2026 - Tous droits réservés.
**Version:** 3.0.0 (Desktop Edition)
**Dernière mise à jour:** 02 Février 2026
