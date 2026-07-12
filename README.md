![Enregistrement 2026-04-07 150959](https://github.com/user-attachments/assets/5558cad4-a5aa-41cb-b407-6aaed49d63f3)

# Django Enterprise Platform

> **Full-stack Python platform — Django • HTML/CSS/JS • PyQt6 • Data Analytics • AI Governance**  
> **Développé par Tayierjiang Tayier**  
> **Rôle : Architecte Logiciel Senior, Expert IA & Fullstack**

Plateforme enterprise de rénovation énergétique (Paris) : application web **Django MVT** en production, client desktop **PyQt6**, pipeline data **+800k enregistrements**, et gouvernance IA.  
**React/Vite** est en cours de migration (V2) — le dashboard actuel fonctionne en **HTML/CSS/JS** via l'API Django.

---

## 🏗️ Architecture actuelle (production)

| Couche | Technologie | Statut |
|--------|-------------|--------|
| **Backend** | Django 6 MVT + API REST interne | ✅ Production |
| **Frontend** | Django Templates + HTML/CSS/JS (ApexCharts) | ✅ Production |
| **Desktop** | PyQt6 Launcher (`DEMARRER.py`) | ✅ Production |
| **Data** | Pandas / NumPy — +800k lignes | ✅ Production |
| **React V2** | React 18 + Vite (`app_launcher/.../react-app/`) | 🚧 Migration en cours |

> **Point important :** le dashboard visible dans la démo GIF est le front **Django MVT** (`templates/` + `static/`), pas React.  
> `_ARCHIVE_TEMPLATES_FAIL/` contient d'anciennes versions HTML abandonnées lors de la migration MVT — ce n'est pas du React.

---

## 🛠️ Stack Technique

- **Backend** : Python 3.12+ | Django 6.0.1 (Architecture MVT)
- **Frontend production** : Django Templates | Tailwind CSS | Vanilla JS (ES6 modules) | ApexCharts
- **Frontend V2 (roadmap)** : React 18 | Vite — scaffold prêt, migration progressive depuis MVT
- **Data Science** : Pandas | NumPy (Traitement de +800k lignes)
- **Desktop App** : PyQt6 | PyQt6-WebEngine (Universal Launcher)
- **Gouvernance** : AI DNA Protocol (Framework interne `.ai_governance`)

---

## 🚀 Démarrage rapide

```bash
# Installation des dépendances Python
pip install -r requirements.txt

# Lancement production (Django + Launcher PyQt6)
python DEMARRER.py
# → Dashboard : http://127.0.0.1:8000/dashboard/

# Optionnel — React V2 (expérimental, port 5174)
python app_launcher/1_CLIC_DEMARRER_V2.py
```

---

## 📂 Structure Globale du Projet

```text
Django-enterprise-platform/
├── batimentRenovation/          # [CORE] Django MVT — URLs, views, settings
├── data/                        # [DATA] Pipeline ETL + API /api/dashboard/*
├── templates/                   # [FRONTEND PROD] Pages Django (dashboard, home…)
├── static/                      # [ASSETS PROD] CSS, JS modules, ApexCharts
│
├── RenovateApp_Launcher/        # [DESKTOP] Gateway PyQt6 (point d'entrée V1)
├── app_launcher/                # [V2] Zone React + launcher hybride
│   └── RenovateApp_Launcher_2/
│       └── ui2/react-app/       # React/Vite — migration future du dashboard
│
├── _ARCHIVE_TEMPLATES_FAIL/     # [ARCHIVE] Anciennes templates HTML (échec migration)
├── DEMARRER.py                  # Point d'entrée production
└── manage.py
```

---

## 🚀 Ce que ce dépôt démontre

1. **Développement Web Django** — MVT, API interne, templates modulaires, auth
2. **Frontend structuré** — HTML/CSS/JS modulaire, expérience proche SPA via API
3. **Desktop PyQt6** — Launcher autonome, déploiement zero-setup
4. **Data Analytics** — +800k lignes, pipelines Python, TableFactory
5. **AI Governance** — Protocole interne de pilotage IA
6. **Roadmap React** — Scaffold V2 prêt, API Django déjà en place pour la migration

---

## 🔄 Migration React — faisable ?

**Oui.** L'API Django (`/api/dashboard/<filename>/`) est déjà le contrat de données.  
La migration consiste à porter les vues `templates/` + `static/js/` vers des composants React, sans toucher au backend.

| Étape | Action |
|-------|--------|
| 1 | Garder Django comme API + auth |
| 2 | Connecter React V2 aux endpoints existants (proxy Vite déjà configuré) |
| 3 | Migrer page par page : dashboard → batiment → dpe → types |
| 4 | Build React → `static/` ou servir via Django en production |

Le scaffold React (`ui2/react-app/`) et le proxy Vite vers `:8000` sont déjà en place.

---

## 🛠️ Composants clés

### Cœur Django (`batimentRenovation/`)

- Pattern MVT, routes dashboard, `@login_required`
- API JSON servie par l'app `data/`

### Frontend production (`templates/` + `static/`)

- Design System « Midnight Glass »
- Controllers JS modulaires (`mainController.js`, `apiFetch.js`)
- Charts ApexCharts alimentés par `/api/dashboard/*`

### Intelligence des données (`data/`)

- Moteur **TableFactory** : volumes massifs → JSON optimisé web
- Pipelines DPE sur +800k enregistrements
- **Data Intelligence V2** : acquisition → DKM → sidebar → charts → chat (KM-only)
  - Doc : [`docs/data_intelligence/README.md`](docs/data_intelligence/README.md)
  - API : `/api/datasets/upload`, `/analyze`, `/knowledge`, `/sidebar`, `/filter`, `/chart`, `/chat`
  - Legacy préservé : `/api/dashboard/<filename>/`
  - Validation : `python scripts/validate_data_platform.py`
  - Tests : `pytest tests/data_intelligence/`
  - **Handoff / journal dev :** [`docs/data_intelligence/HISTORIQUE_DEVELOPPEMENT.md`](docs/data_intelligence/HISTORIQUE_DEVELOPPEMENT.md)

### React V2 (`app_launcher/RenovateApp_Launcher_2/ui2/`)

- Environnement React/Vite isolé (port 5174)
- Proxy API vers Django — base pour la migration progressive

### Launcher Desktop (`RenovateApp_Launcher/`)

- `DEMARRER.py` → PyQt6 → `http://127.0.0.1:8000/dashboard/`

---

## 🔐 Gouvernance & Sécurité

- Protocole de gouvernance IA
- Protection via `ALLOWED_HOSTS` et isolation des variables d'environnement
- Communication sécurisée entre `data` et `batimentRenovation`

---

## 📤 État du projet

- ✅ **Production** : Django MVT + HTML/CSS/JS + PyQt6 + Data Analytics
- 🚧 **En cours** : Migration progressive vers React V2
- 📘 **Documentation V2 Data Intelligence** : [`docs/data_intelligence/README.md`](docs/data_intelligence/README.md) — plateforme universelle CSV/Excel (Knowledge Manifest)
- ✅ Portfolio orienté ESN et recruteurs techniques

_Dernière mise à jour : Juillet 2026 par Tayierjiang Tayier_
