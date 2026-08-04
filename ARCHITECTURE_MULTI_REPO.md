# Architecture Multi-Repo — Django Enterprise Platform

> **Document de référence** — Division en 5 repos indépendants
> **Auteur :** Tayierjiang Tayier — Architecte Logiciel Senior
> **Date :** Avril 2026

---

## 🧠 Anatomie du système

```
                    ┌─────────────────────┐
                    │       backend       │
                    │  (Django + data API)│
                    │   :8000/api/*       │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │ HTTP/JSON      │                │ HTTP/JSON
              ▼                │                ▼
   ┌──────────────────┐        │     ┌────────────────────┐
   │     web-mvt      │        │     │   desktop-react    │
   │  ┌────────────┐  │        │     │  ┌──────────────┐  │
   │  │  UI MVT    │  │        │     │  │  UI React    │  │
   │  │templates + │  │        │     │  │  Vite + JSX  │  │
   │  │  static    │  │        │     │  │              │  │
   │  └─────┬──────┘  │        │     │  └──────┬───────┘  │
   │        │         │        │     │         │          │
   │  ┌─────▼──────┐  │        │     │  ┌──────▼───────┐  │
   │  │ Launcher-1 │  │        │     │  │ Launcher-2   │  │
   │  │ PyQt6 V1   │  │        │     │  │ PyQt6 V2     │  │
   │  │WebEngine   │  │        │     │  │Hybride       │  │
   │  └────────────┘  │        │     │  └──────────────┘  │
   └──────────────────┘        │     └────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │        docs         │  ← dépend de tous (référence)
                    └─────────────────────┘

                    ┌─────────────────────┐
                    │      archive        │  ← indépendant (lecture seule)
                    └─────────────────────┘
```

**Principe clé :** 1 backend partagé, consommé par 2 paires (UI + Launcher).

---

## 📦 Les 5 repos

| Repo | Nom | Rôle | Contenu |
|------|-----|------|---------|
| **R1** | `backend` | API + pipeline data | Django MVT, data ETL, scripts, tests |
| **R2** | `web-mvt` | UI-1 + Launcher-1 | templates, static, PyQt6 V1 |
| **R3** | `desktop-react` | UI-2 + Launcher-2 | React/Vite, PyQt6 V2 hybride |
| **R4** | `docs` | Documentation | specs, ADR, historique |
| **R5** | `archive` | Legacy | zip, templates échouées, notebooks |

---

## 🗂️ Structure détaillée par repo

### R1 — `backend`

```
backend/
├── batimentRenovation/          # Django MVT core
│   ├── core/                    # backends auth
│   ├── migrations/
│   ├── admin.py
│   ├── models.py
│   ├── settings.py
│   ├── urls.py
│   └── views.py
├── data/                        # API + pipeline ETL
│   ├── mcp/                     # MCP tools
│   ├── migrations/
│   ├── services/                # acquisition, processing, intelligence, runtime
│   ├── dataset_store.py
│   ├── dtos.py
│   ├── urls.py
│   └── views*.py
├── scripts/                     # create_admin, validate_data_platform
├── tests/                       # tests backend + data_intelligence
├── manage.py
├── requirements.txt
├── pytest.ini
└── README.md
```

**Droits :** Devs Python/Django — lecture/écriture
**CI/CD :** pytest + validation data platform

---

### R2 — `web-mvt`

```
web-mvt/
├── ui/                          # Frontend MVT (production)
│   ├── templates/               # Django Templates
│   │   ├── components/
│   │   ├── layouts/
│   │   └── pages/
│   └── static/                  # CSS, JS, ApexCharts
│       ├── assets/
│       ├── css/
│       ├── data/
│       └── js/
└── launcher/                    # PyQt6 V1 (point d'entrée)
    ├── app_launcher.py
    ├── core/
    ├── ui/
    └── requirements.txt
```

**Droits :** Devs frontend (HTML/CSS/JS) + desktop PyQt6
**CI/CD :** build static + test launcher paths

---

### R3 — `desktop-react`

```
desktop-react/
├── ui/                          # React/Vite (migration V2)
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── i18n/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── reference/
│   │   ├── styles/
│   │   └── utils/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── launcher/                    # PyQt6 V2 hybride
    ├── app_launcher.py
    ├── core/
    └── requirements.txt
```

**Droits :** Devs React + desktop PyQt6
**CI/CD :** build Vite + test launcher hybride

---

### R4 — `docs`

```
docs/
├── data_intelligence/           # 15+ specs + ADR
│   ├── adr/
│   ├── ARCHITECTURE_UNIVERSAL_DATA_PLATFORM.md
│   ├── DATA_KNOWLEDGE_MANIFEST_SPEC.md
│   └── ...
├── HISTORIQUE_DEVELOPPEMENT.md
├── GUIDE_COMMIT_REMOTE.md
└── README.md
```

**Droits :** Tech writers + leads — lecture/écriture
**CI/CD :** validation markdown

---

### R5 — `archive`

```
archive/
├── TAYIER_V1_LEGACY_DELIVERY.zip
├── templates-fail/              # _ARCHIVE_TEMPLATES_FAIL/
└── notebooks/                   # data/test/*.ipynb
```

**Droits :** Lecture seule (audit/historique)

---

## 🔐 Droits d'accès (RBAC)

| Rôle | backend | web-mvt | desktop-react | docs | archive |
|------|---------|---------|---------------|------|---------|
| **Dev Backend** | ✅ RW | 👁️ RO | 👁️ RO | 👁️ RO | ❌ |
| **Dev Frontend MVT** | 👁️ RO | ✅ RW | ❌ | 👁️ RO | ❌ |
| **Dev React** | 👁️ RO | ❌ | ✅ RW | 👁️ RO | ❌ |
| **Dev Desktop** | 👁️ RO | ✅ RW | ✅ RW | 👁️ RO | ❌ |
| **Tech Writer / Lead** | 👁️ RO | 👁️ RO | 👁️ RO | ✅ RW | 👁️ RO |
| **Audit / Historique** | ❌ | ❌ | ❌ | ❌ | ✅ RO |

> ✅ RW = Lecture + Écriture | 👁️ RO = Lecture seule | ❌ = Aucun accès

---

## 🔄 Dépendances inter-repos

| Composant | Dépend de | Type | Mécanisme |
|-----------|-----------|------|-----------|
| `web-mvt/ui` | `backend` | Runtime | HTTP API `/api/*` |
| `web-mvt/launcher` | `web-mvt/ui` | Runtime | PyQt6 WebEngine |
| `desktop-react/ui` | `backend` | Runtime | HTTP API `/api/*` (proxy Vite) |
| `desktop-react/launcher` | `desktop-react/ui` | Runtime | PyQt6 WebEngine |
| `docs` | tous | Référence | Documentation |
| `archive` | aucun | — | Indépendant |

---

## 🚀 Stratégie de migration

### Phase 1 — Sécurité (fait ✅)
- [x] Commit de sécurité : `68a7339`
- [x] Tag : `pre-split-safety-checkpoint`

### Phase 2 — Création des repos
1. Créer les 5 repos sur GitHub/GitLab
2. Copier les dossiers selon la structure ci-dessus
3. Configurer les droits RBAC par repo

### Phase 3 — Adaptation du backend
1. `settings.py` : utiliser des variables d'env pour `TEMPLATES_DIR` et `STATICFILES_DIR`
2. `DEMARRER.py` : séparer le lancement Django du lancement PyQt6

### Phase 4 — CI/CD
1. Pipeline backend : `pytest` + `validate_data_platform.py`
2. Pipeline web-mvt : build static + tests launcher
3. Pipeline desktop-react : build Vite + tests launcher

---

## 📌 Points d'attention

1. **`DEMARRER.py`** — actuellement lance Django + PyQt6 ensemble. À séparer :
   - `backend` : `python manage.py runserver`
   - `web-mvt/launcher` : lance PyQt6 → pointe vers `:8000`
   - `desktop-react/launcher` : lance PyQt6 → pointe vers `:5174` (Vite) ou `:8000`

2. **`settings.py`** — `TEMPLATES` et `STATICFILES_DIRS` doivent être configurables :
   ```python
   import os
   TEMPLATES_DIR = os.environ.get("FRONTEND_TEMPLATES_DIR", BASE_DIR / "templates")
   STATICFILES_DIRS = [os.environ.get("FRONTEND_STATIC_DIR", BASE_DIR / "static")]
   ```

3. **Tests** — `tests/test_launcher_paths.py` teste le desktop → doit suivre `web-mvt`

4. **Notebooks** — `data/test/*.ipynb` → déplacés dans `archive/notebooks/`

---

## 📋 Historique des décisions

| Date | Décision | Justification |
|------|----------|---------------|
| Avril 2026 | Division en 5 repos | Cohésion UI+Launcher, couplage faible, RBAC granulaire |
| Avril 2026 | Nommage sans préfixe | Noms techniques purs : `backend`, `web-mvt`, `desktop-react`, `docs`, `archive` |
| Avril 2026 | Commit de sécurité avant split | Point de restauration `pre-split-safety-checkpoint` |

---

_Dernière mise à jour : Avril 2026 — Tayierjiang Tayier_