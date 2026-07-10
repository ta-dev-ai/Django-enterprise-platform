# Django Enterprise Platform

> **Full-stack Python platform — Django • React • PyQt6 • Data Analytics • AI Governance**  
> **Développé par Tayierjiang Tayier**  
> **Rôle : Architecte Logiciel Senior, Expert IA & Fullstack**

Plateforme enterprise combinant une application web Django, un client desktop PyQt6, un dashboard React/Vite, l'analyse de données à grande échelle (+800k enregistrements) et des composants de gouvernance IA — démonstration portfolio prête pour un contexte ESN.

---

## 🛠️ Stack Technique

- **Backend** : Python 3.12+ | Django 6.0.1 (Architecture MVT)
- **Frontend Web** : Django Templates | Tailwind CSS | ApexCharts | Material Symbols
- **Frontend React** : React | Vite (Dashboard V2 — `app_launcher/RenovateApp_Launcher_2/ui2/`)
- **Data Science** : Pandas | NumPy (Traitement de +800k lignes)
- **Desktop App** : PyQt6 | PyQt6-WebEngine (Universal Launcher)
- **Gouvernance** : AI DNA Protocol (Framework interne `.ai_governance`)

---

## 📂 Structure Globale du Projet

```text
Django-enterprise-platform/
├── batimentRenovation/          # [CORE] Système nerveux central (Django MVT)
│   ├── settings.py
│   ├── urls.py
│   ├── views.py
│   ├── models.py
│   └── wsgi.py / asgi.py
│
├── data/                        # [DATA] Pipeline Big Data & API
│   ├── services/data_processing/
│   ├── dtos.py
│   └── views.py
│
├── templates/                   # [FRONTEND] Rendu modulaire Django
├── static/                      # [ASSETS] Design System "Midnight Glass"
│
├── RenovateApp_Launcher/        # [DESKTOP] Gateway PyQt6 (Zero-Setup)
│   ├── app_launcher.py
│   └── engine/
│
├── app_launcher/                # [HYBRID] Django + React (V2)
│   └── RenovateApp_Launcher_2/
│       └── ui2/react-app/       # Dashboard React/Vite
│
├── DEMARRER.py                  # Point d'entrée unique
├── manage.py
└── requirements.txt
```

---

## 🚀 Ce que ce dépôt démontre

1. **Développement Web Django** — MVT, API interne, templates modulaires, sécurité
2. **Frontend React** — Dashboard V2 avec React/Vite en architecture hybride
3. **Desktop PyQt6** — Launcher autonome pour déploiement sans configuration
4. **Data Analytics** — Traitement de +800k lignes (rénovation énergétique Paris)
5. **AI Governance** — Protocole interne de pilotage et validation IA

---

## 🛠️ Composants clés

### Cœur Django (`batimentRenovation/`)

- Sécurité des secrets (CSRF, clés isolées)
- Pattern MVT avec synchronisation SQLite / interface

### Intelligence des données (`data/`)

- Moteur **TableFactory** : volumes massifs → JSON optimisé pour le web
- API interne fluide, expérience proche SPA

### Frontend React (`app_launcher/RenovateApp_Launcher_2/ui2/`)

- Dashboard V2 en React/Vite
- Architecture hybride : Django (port 8000) + React (port 5174)

### Launcher Desktop (`RenovateApp_Launcher/`)

- `DEMARRER.py` automatise la détection de l'environnement Python
- Tunneling PyQt6 : application web encapsulée en logiciel bureau

---

## 🔐 Gouvernance & Sécurité

- Protocole de gouvernance IA et launcher desktop hybride
- Protection via `ALLOWED_HOSTS` et isolation des variables d'environnement
- Communication sécurisée entre `data` et `batimentRenovation`

---

## 📤 État du projet

- ✅ Architecture validée et structurée
- ✅ Stack : Django, React, PyQt6, Data Analytics, AI Governance
- ✅ Portfolio orienté ESN et recruteurs techniques

_Dernière mise à jour : Juillet 2026 par Tayierjiang Tayier_
