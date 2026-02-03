# 📊 Rapport de Traçabilité des Données (Tableaux Détails)

**Date :** 03/02/2026
**Objet :** Cartographie des Flux de Données "Tableaux" (JSON)

Ce document complète le rapport précédent en détaillant le flux des données tabulaires (Grilles de données en bas de page).

---

## 🏗️ 1. Données "Financières" (`table_financial.json`)

Contient les données de coût, de primes et de valorisation.

- **Utilisé par :** Page `batiment.html`
- **Chemin Physique :** `data/services/data_processing/export_dashboard/table_financial.json`
- **Route d'Accès :** `/api/dashboard/table_financial/`

## 🛠️ 2. Données "Techniques" (`table_technical.json`)

Contient les détails techniques (Surface, Matériaux, Type de travaux).

- **Utilisé par :** Page `types.html`
- **Chemin Physique :** `data/services/data_processing/export_dashboard/table_technical.json`
- **Route d'Accès :** `/api/dashboard/table_technical/`

## 📈 3. Données "Marché" (`table_market.json`)

Contient les données de valorisation immobilière liées au DPE et au marché.

- **Utilisé par :** Page `dpe.html`
- **Chemin Physique :** `data/services/data_processing/export_dashboard/table_market.json`
- **Route d'Accès :** `/api/dashboard/table_market/`

---

## 🔗 Intégrité du Système

Toutes les vues (Graphiques ET Tableaux) sont désormais connectées aux données vivantes du "Moteur Scientifique" via les routes sécurisées `/api/dashboard/*`.
Les redirections via Django garantissent que les fichiers JSON bruts ne sont pas exposés directement dans `/static/`.

**Validation :**

- ✅ `batiment.html` appel -> `/api/dashboard/table_financial/`
- ✅ `types.html` appel -> `/api/dashboard/table_technical/`
- ✅ `dpe.html` appel -> `/api/dashboard/table_market/`
