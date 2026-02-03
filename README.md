# 🏗️ Écosystème Rénovation Énergétique Paris

> **Développé par Tayierjiang Tayier (2026)**
> Cette documentation détaille l'arborescence et la logique d'ingénierie de la plateforme pour une présentation académique et professionnelle.

---

## 📂 Structure Globale du Projet (Arborescence)

Voici l'organisation logique du projet. Chaque composant a un rôle défini pour assurer la modularité et la scalabilité de l'écosystème.

```text
PROJET_RENOVATE/
├── batimentRenovation/      # [CORE] Cœur du Projet Django (MVT)
│   ├── settings.py          # Configuration, Connexions & Secrets
│   ├── urls.py              # Routage principal des requêtes
│   ├── views.py             # Logique métier et injection de données
│   ├── models.py            # Structures de données (BDD)
│   └── wsgi.py/asgi.py      # Interfaces serveurs (Web Gateway)
│
├── data/                    # [DATA APP] Logiciel de Pipeline & API
│   ├── services/            # Scripts de transformation (ETL)
│   │   └── data_processing/ # Moteurs de calcul (TableFactory, Pipeline)
│   ├── dtos.py              # Objets de Transfert de Données (JSON clean)
│   └── views.py             # API Endpoint (Alimente le Dashboard)
│
├── templates/               # [FRONTEND] Architecture de Rendu MVT
│   ├── layouts/             # Squelettes (Masters) du site (DRY)
│   ├── components/          # Morceaux d'UI réutilisables (Nav, Sidebar)
│   └── pages/               # Contenu spécifique des vues Django
│
├── static/                  # [ASSETS] Ressources statiques
│   ├── css/                 # Design System "Midnight Glass"
│   ├── js/                  # Interactivité & ApexCharts logic
│   └── img/                 # Logos et branding
│
├── RenovateApp_Launcher/    # [GATEWAY] Satellite Bureau (PyQt6)
│   ├── app_launcher.py      # Script de démarrage de la fenêtre
│   └── engine/              # Environnement Python portable (venv)
│
├── DEMARRER.py              # Point d'entrée unique (Automate)
├── manage.py                # Outil de gestion standard Django
└── requirements.txt         # Dépendances du projet
```

---

## 🛠️ Explication des Composants Clés

### 1. Le Cœur Logiciel (`batimentRenovation/`)

C'est le système nerveux central.

* **Connexion & Secrets** : Dans `settings.py`, la variable `SECRET_KEY` (le "code secret") sécurise les sessions et les jetons CSRF. C'est ici que l'on connecte la **Base de Donnée** (SQLite) et que l'on définit les chemins vers les dossiers de ressources.
* **Injection MVT** : Les `views.py` récupèrent les données traitées par l'application `data` et les injectent dans les `templates`.

### 2. L'Intelligence des Données (`data/`)

Le projet ne se contente pas d'afficher des données, il les fabrique.

* **TableFactory** : Une classe d'ingénierie qui prend 800 000 lignes brutes et les transforme en matrices JSON ultra-légères optimisées pour le Web.
* **API Interne** : Fournit les données au format JSON pour que le Dashboard soit fluide sans rechargement de page (SPA-like).

### 3. La Structure Visuelle (`templates/`)

L'arborescence des templates suit la méthodologie **DRY (Don't Repeat Yourself)** :

* **Logic de Squelette** : On ne réécrit pas le menu ou le logo sur chaque page. `main_layout.html` contient le code commun. Les pages dans `pages/` utilisent `{% extends %}` pour charger ce squelette et `{% block %}` pour insérer leur contenu unique.
* **Composants** : Les éléments comme la `sidebar` ou les `recherche_filters` sont isolés dans `components/` pour être modifiés à un seul endroit.

### 4. Le Pont de Déploiement (`RenovateApp_Launcher/`)

C'est l'innovation de "portabilité" :

* Le script **`DEMARRER.py`** est une couche d'abstraction qui détecte si Python est installé.
* Le **Launcher PyQt6** agit comme un navigateur dédié dont le "code secret" technique consiste à créer un tunnel local vers le serveur Django pour transformer un site web en logiciel de bureau autonome.

---

## 🔐 Sécurité et Interconnexion

Le projet utilise un système de **"Secrets Encapsulés"** :

1. **SECRET_KEY** : Protège contre les attaques de session.
2. **ALLOWED_HOSTS** : Restreint l'accès au serveur uniquement à la machine locale via le Launcher.
3. **Cross-App Bridge** : L'application `data` et `batimentRenovation` communiquent via l'importation de modules Python internes, évitant toute fuite de données vers l'extérieur.

---

## 🎓 Note Méthodologique 

Cette structure a été choisie pour démontrer une capacité à gérer des projets de **niveau industriel**.

* Séparation nette entre le **Traitement de Données (Backend)** et la **Présentation (Frontend)**.
* Utilisation de **Pipelines automatisés** pour la fluidité de l'interface.
* **Architecture Hybride** (Web + Desktop) unique.

---

_Dernière mise à jour : 03 Février 2026_
