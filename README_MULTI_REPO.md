# Multi-Repo Target — Django Enterprise Platform

> **Structure cible** — Division en 5 repos indépendants
> **Auteur :** Tayierjiang Tayier — Architecte Logiciel Senior
> **Date :** Avril 2026

---

## 🏗️ Structure finale

```
multi-repo-target/
├── backend/           # R1 — API + pipeline data (Django MVT, data ETL, scripts, tests)
├── web-mvt/           # R2 — UI-1 (templates+static) + Launcher-1 (PyQt6 V1)
│   ├── ui/            #     Frontend MVT (templates + static)
│   └── launcher/      #     PyQt6 V1 (app_launcher.py, core, ui)
├── desktop-react/     # R3 — UI-2 (React/Vite) + Launcher-2 (PyQt6 V2)
│   ├── ui/            #     React/Vite (react-app)
│   └── launcher/      #     PyQt6 V2 (app_launcher.py, core)
├── docs/              # R4 — Documentation (specs, ADR, historique)
└── archive/           # R5 — Legacy (structuré : source-original, doublons, obsolete, legacy)
```

---

## 📦 Les 5 repos

| Repo | Rôle | Contenu |
|------|------|---------|
| **`backend`** | API + pipeline data | Django MVT, data ETL, scripts, tests |
| **`web-mvt`** | UI-1 + Launcher-1 | templates, static, PyQt6 V1 |
| **`desktop-react`** | UI-2 + Launcher-2 | React/Vite, PyQt6 V2 hybride |
| **`docs`** | Documentation | specs, ADR, historique |
| **`archive`** | Legacy | zip, templates échouées, notebooks |

---

## 🗄️ Structure d'archive

```
archive/
├── source-original/        # Code source original (référence)
├── doublons/               # Doublons retirés de la réorganisation
├── obsolète/               # Éléments obsolètes
└── legacy/                 # Anciennes versions
```

---

## 🔒 Sécurité

- **Point de restauration :** tag `pre-split-safety-checkpoint`
- **Règle d'OR :** Nettoyer = Archiver, JAMAIS supprimer (voir `CONTEXT_RULES.md`)

---

## 📚 Documentation

- [`ARCHITECTURE_MULTI_REPO.md`](../ARCHITECTURE_MULTI_REPO.md) — division, structure, RBAC
- [`DEPENDENCY_MATRIX.md`](../DEPENDENCY_MATRIX.md) — matrice de dépendances inter-repos
- [`CONTEXT_RULES.md`](../CONTEXT_RULES.md) — règles globales de contexte

---

_Dernière mise à jour : Avril 2026 — Tayierjiang Tayier_