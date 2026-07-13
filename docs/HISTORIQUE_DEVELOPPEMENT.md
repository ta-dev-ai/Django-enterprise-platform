# Historique de développement — Django Enterprise Platform

_Handoff officiel — Juillet 2026_  
**Repo :** https://github.com/ta-dev-ai/Django-enterprise-platform.git  
**Auteur :** Tayierjiang Tayier (Tayier NIMAIT)

> **Document à lire en premier** si tu reprends le projet après une pause, un changement de machine ou avec un nouvel agent IA.

---

## 0. Reprise rapide (30 secondes)

```bash
git clone https://github.com/ta-dev-ai/Django-enterprise-platform.git
cd Django-enterprise-platform
git checkout feature/swiss-esn-vitrine   # ← branche la plus avancée (tout le travail récent)
pip install -r requirements.txt

# Terminal 1 — Django production
python DEMARRER.py
# → http://127.0.0.1:8000/

# Terminal 2 — React V2 (optionnel)
cd app_launcher/RenovateApp_Launcher_2/ui2/react-app
npm install
npm run dev
# → http://localhost:5174/#/
```

| Besoin | Où aller |
|--------|----------|
| **Reprendre le dev front React** | Branche `feature/swiss-esn-vitrine`, dossier `app_launcher/.../react-app/` |
| **Prod stable (ne pas casser)** | Branche `main`, MVT `templates/` + `static/` |
| **Data Intelligence V2** | `docs/data_intelligence/HISTORIQUE_DEVELOPPEMENT.md` |
| **Parité React seule** | Branche `feature/react-parity` (jalon figé) |
| **Login démo** | `demo@renovenergy.com` / `demo1234` |
| **Contact recruteur CH** | `batimentRenovation/site_config.py` |

---

## 1. Arborescence Git (branches)

```
main                          ← PROD STABLE (MVT Django uniquement)
 └── feature/react-parity      ← Parité React complète (pages + dashboard)
      └── feature/swiss-esn-vitrine   ← ACTIF : Swiss vitrine + Data Intel V2
```

| Branche | Commit tête | Remote | Rôle |
|---------|-------------|--------|------|
| `main` | `1a5e09a` | ✅ | Production MVT, ne pas y merger sans validation |
| `feature/react-parity` | `a97c2cf` | ✅ | Jalon « React = MVT » (vitrine + dashboard + auth démo) |
| `feature/swiss-esn-vitrine` | `2c70acb` | ✅ | **Branche de travail actuelle** — tout ci-dessous |

### Commits clés sur `feature/swiss-esn-vitrine`

| Commit | Phase | Contenu |
|--------|-------|---------|
| `728ee8a` | React Phase 1 | API parity layer isolée |
| `c7b6702` | React Phase 2 | Structure dashboard portée MVT |
| `14db467` | React | Bridge controllers legacy (ApexCharts) |
| `a32e081` | React | Sidebar DOM aligné MVT |
| `d2d05e5` | React | Sous-pages batiment/types/dpe + hash routing |
| `a97c2cf` | **react-parity** | Pages vitrine, auth démo, responsive, EnterpriseDataTable |
| `18480b8` | **Swiss P0** | Pages légales, tokens Swiss, FR/DE, footer contact CH |
| `8d0390c` | **Swiss P1** | Home bento recruteurs, tableau enterprise hybride |
| `6923336` | **Data Intel V2** | Plateforme universelle CSV/Excel + DKM |
| `2c70acb` | Fix | Imports `LegalPageShell` → `../components/` |

---

## 2. Chronologie du développement (grandes phases)

### Phase A — Fondation (main)

- Django 6 MVT en production (`:8000`)
- Dashboard HTML/CSS/JS + ApexCharts
- API `/api/dashboard/<filename>/`
- Launcher PyQt6 `DEMARRER.py`
- Pipeline data +800k lignes DPE Paris

### Phase B — Migration React V2 (`feature/react-parity`)

**Objectif :** parité 100 % MVT ↔ React sans inventer de design.

| Livré | Fichiers / routes |
|-------|-------------------|
| Dashboard + bridge legacy | `LegacyControllerBridge.jsx`, `DashboardShell.jsx` |
| Hash routing | `#/dashboard`, `#/batiment`, `#/types`, `#/dpe` |
| Pages vitrine React | `HomePage`, `AboutPage`, `ContactPage`, `CvPage`, `LoginPage`, `AdminPage`, `404` |
| Auth démo | `batimentRenovation/demo_auth.py`, login MVT + React |
| Responsive mobile | `static/css/pages/dashboard.css`, sidebar hamburger |
| Tableau enterprise | `EnterpriseDataTable.jsx`, `BatimentSectionPanel.jsx` (table/3D/bulles) |
| Proxy Vite | `vite.config.js` → Django `:8000` |

**Règle d'or :** MVT (`templates/`) = source de vérité UI. Ne pas inventer de design dans React.

### Phase C — Swiss vitrine CH/ESN (`feature/swiss-esn-vitrine`)

**Cible :** recruteurs suisses, ESN — sobriété, crédibilité légale, CV visible.

| Jalon | Livré |
|-------|-------|
| **P0** | `swiss-vitrine.css`, pages légales MVT+React, switcher FR/DE, `site_config.py`, footer unifié |
| **P1** | Home bento (`home-bento.css`, `SwissHomeBento.jsx`), `tableColumnMeta.js`, `enterprise_table.css` |

**URLs légales :**

- MVT : `/mentions-legales/`, `/confidentialite/`, `/impressum/`
- React : `#/mentions-legales`, `#/confidentialite`, `#/impressum`

### Phase D — Data Intelligence V2 (`6923336`)

**Objectif :** plateforme universelle CSV/Excel avec Data Knowledge Manifest (DKM).

→ **Doc détaillée :** [`docs/data_intelligence/HISTORIQUE_DEVELOPPEMENT.md`](data_intelligence/HISTORIQUE_DEVELOPPEMENT.md)

- API V2 : `/api/datasets/upload`, `/analyze`, `/knowledge`, `/sidebar`, `/filter`, `/chart`, `/chat`
- API V1 préservée : `/api/dashboard/*`
- Tests : `pytest tests/data_intelligence/` (19/19)
- Validation : `python scripts/validate_data_platform.py`

---

## 3. Architecture à deux fronts

```
┌─────────────────────────────────────────────────────────────┐
│  PRODUCTION (:8000)          │  REACT V2 (:5174)             │
│  Django MVT + templates/     │  Vite + HashRouter           │
│  static/js/controllers/      │  LegacyControllerBridge      │
│  ApexCharts window global    │  Même CSS static/ partagé    │
└─────────────────────────────────────────────────────────────┘
                              │
                    API Django :8000
                    /api/dashboard/*
                    /api/datasets/*
```

| Zone | Ne pas casser en prod |
|------|------------------------|
| `templates/pages/dashboard/` | Controllers JS legacy |
| `static/js/controllers/` | `mainController.js`, `buildingController.js` |
| `data/views.py` | API V1 dashboard |
| `DEMARRER.py` | Point d'entrée recruteur |

| Zone | Travail React autorisé |
|------|------------------------|
| `app_launcher/.../react-app/src/` | Composants, pages, i18n |
| `static/css/base/swiss-vitrine.css` | Tokens vitrine (scoped `body.swiss-vitrine`) |
| `static/css/pages/home-bento.css` | Home bento |
| `static/css/modules/enterprise_table.css` | Tableau enterprise |

---

## 4. Fichiers clés (carte)

### Configuration & contact

| Fichier | Rôle |
|---------|------|
| `batimentRenovation/site_config.py` | Coordonnées CH, email recruteur, GitHub |
| `batimentRenovation/demo_auth.py` | Compte démo auto-créé |
| `batimentRenovation/urls.py` | Routes dont pages légales |

### React V2

| Fichier | Rôle |
|---------|------|
| `react-app/src/App.jsx` | Routes HashRouter |
| `react-app/src/reference/mvtPageMap.js` | Correspondance MVT ↔ React |
| `react-app/src/LegacyControllerBridge.jsx` | ApexCharts + controllers legacy |
| `react-app/src/i18n/` | FR/DE, contenu légal |
| `react-app/src/components/SwissHomeBento.jsx` | Home recruteurs |
| `react-app/src/components/dashboard/EnterpriseDataTable.jsx` | Tableau registre |
| `react-app/src/constants/tableColumnMeta.js` | Labels colonnes, primaire/détail |

### CSS Swiss

| Fichier | Rôle |
|---------|------|
| `static/css/base/swiss-vitrine.css` | Tokens `#FAFAF8`, teal `#0D5C63`, flat |
| `static/css/pages/home-bento.css` | Grille bento home |
| `static/css/pages/legal.css` | Pages légales |
| `static/css/modules/enterprise_table.css` | Style tableau hybride |

---

## 5. URLs de test

| Page | MVT | React |
|------|-----|-------|
| Accueil | `http://127.0.0.1:8000/` | `http://localhost:5174/#/` |
| Dashboard | `http://127.0.0.1:8000/dashboard/` | `http://localhost:5174/#/dashboard` |
| Login démo | `http://127.0.0.1:8000/login/?mode=demo` | `http://localhost:5174/#/login` |
| CV | `http://127.0.0.1:8000/cv/` | `http://localhost:5174/#/cv` |
| Mentions légales | `/mentions-legales/` | `#/mentions-legales` |

---

## 6. Erreurs connues & correctifs

| Problème | Cause | Fix |
|----------|-------|-----|
| Vite : `Failed to resolve import "./LocaleSwitcher"` | Mauvais chemin dans `LegalPageShell.jsx` | `../components/LocaleSwitcher` (commit `2c70acb`) |
| Dashboard React vide (charts) | ApexCharts manquant | `index.html` charge `/static/js/cdn/jsdelivr.js` + `window.DATA_URLS` |
| Login React ne garde pas session | Cookie CSRF / proxy | Vérifier proxy Vite `/login` → `:8000` |
| `git status` plein de node_modules | Non ignorés historiquement | **Ne pas committer** `node_modules/`, `dist/`, `db.sqlite3` |
| Home affiche encore hero stock | Normal | Sections legacy masquées par `body.swiss-vitrine` + bento au-dessus |

---

## 7. Ce qui reste à faire (roadmap)

### Priorité haute — Swiss / portfolio recruteurs

| # | Tâche | Branche suggérée |
|---|-------|------------------|
| P2 | Finaliser home : retirer HTML legacy home (hero, team pravatar) du repo | `feature/swiss-esn-vitrine` |
| P3 | Compléter i18n DE sur toutes les pages vitrine (about, contact) | idem |
| P4 | Remplacer placeholders UID/téléphone dans `site_config.py` | idem |
| P5 | Merge `feature/swiss-esn-vitrine` → `feature/react-parity` puis PR vers `main` | quand validé |

### Priorité moyenne — React parity

| # | Tâche |
|---|-------|
| R1 | Vérifier session cookie login React `:5174` → Django |
| R2 | Porter Data Explorer React (upload CSV) depuis API V2 |
| R3 | Build React prod → servir via Django `static/` |
| R4 | Remplacer MVT dashboard par React en prod (dernière étape) |

### Priorité data — Data Intelligence V2

| # | Tâche | Doc |
|---|-------|-----|
| D1 | Brancher LLM externe (optionnel, ADR-002) | `docs/data_intelligence/adr/` |
| D2 | UI React pour upload/explorer datasets | `USER_JOURNEY_UPLOAD_TO_VIZ.md` |
| D3 | Durcir CSRF sur API V2 POST | handoff data |

### Ne pas faire (pièges)

- ❌ Merger React dans `main` sans tests manuels MVT `:8000`
- ❌ Committer `node_modules/`, `db.sqlite3`, fichiers `.env`
- ❌ Inventer un nouveau design React (toujours calquer MVT)
- ❌ Modifier `data/views.py` (API V1) pour la V2 — utiliser `data/views_datasets.py`

---

## 8. Où commencer selon ton objectif

| Tu veux… | Commence par… |
|----------|-----------------|
| **Reprendre le portfolio recruteur CH** | `feature/swiss-esn-vitrine`, lire P2 ci-dessus, fichiers `SwissHomeBento.jsx` + `site_config.py` |
| **Finir la migration React dashboard** | `mvtPageMap.js`, comparer `templates/pages/dashboard/` vs `react-app/src/pages/` |
| **Travailler sur les données / upload CSV** | `docs/data_intelligence/HISTORIQUE_DEVELOPPEMENT.md`, `pytest tests/data_intelligence/` |
| **Corriger un bug prod MVT** | `main`, `DEMARRER.py`, ne toucher que `templates/` + `static/` |
| **Préparer une démo recruteur** | Lancer les 2 serveurs, home bento + CV + dashboard démo login |

---

## 9. Commandes utiles

```bash
# État Git
git checkout feature/swiss-esn-vitrine
git pull origin feature/swiss-esn-vitrine
git log --oneline -10

# Tests data V2
pytest tests/data_intelligence/ -q
python scripts/validate_data_platform.py

# Diff vs main
git diff main...feature/swiss-esn-vitrine --stat

# Push après travail
git add <fichiers sources uniquement>
git commit -m "feat(scope): description"
git push origin feature/swiss-esn-vitrine
```

---

## 10. Documents liés

| Document | Contenu |
|----------|---------|
| [`README.md`](../README.md) | Vue d'ensemble, démarrage rapide |
| [`docs/data_intelligence/HISTORIQUE_DEVELOPPEMENT.md`](data_intelligence/HISTORIQUE_DEVELOPPEMENT.md) | Data Intelligence V2 en détail |
| [`docs/data_intelligence/README.md`](data_intelligence/README.md) | Specs ontologie data |
| `app_launcher/.../react-app/src/reference/mvtPageMap.js` | Table de correspondance pages MVT/React |

---

## 11. Journal des sessions (résumé)

| Date | Session | Résultat |
|------|---------|----------|
| 2026-03/04 | Fondation MVT + data | `main` stable |
| 2026-04 | Migration React Phase 1-2 | API + structure dashboard |
| 2026-07 | React parity complet | `feature/react-parity` `a97c2cf` |
| 2026-07 | Swiss P0/P1 vitrine CH | legal, i18n, bento, tableau |
| 2026-07 | Data Intelligence V2 | DKM, upload CSV, 19 tests |
| 2026-07 | Fix LegalPageShell + push officiel | `2c70acb` sur remote |

---

_Dernière mise à jour : 13 juillet 2026 — branche `feature/swiss-esn-vitrine` @ `2c70acb`_
