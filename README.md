# RenovateEnergy - Plateforme de Rénovation Énergétique

## 📋 Description

RenovateEnergy est une plateforme web Django dédiée à la visualisation et l'analyse des données de rénovation énergétique des bâtiments parisiens. L'application propose des tableaux de bord interactifs avec des graphiques ApexCharts pour suivre les projets de rénovation, les types de travaux et les performances DPE.

## 🏗️ Architecture du Projet

### Structure des Dossiers

```
batiment-renovation-paris-monta - Copie/
├── batimentRenovation/          # Application Django principale
│   ├── models.py                # Modèles de données (User, etc.)
│   ├── views.py                 # Vues originales (production)
│   ├── views_v2.py              # Vues V2 (nouvelle architecture)
│   ├── urls.py                  # Configuration des URLs
│   └── settings.py              # Configuration Django
├── templates/                   # Templates HTML (nouvelle architecture)
│   ├── layouts/                 # Layouts de base
│   │   ├── dashboard_layout.html
│   │   └── main_layout.html
│   ├── pages/                   # Pages de l'application
│   │   ├── home.html
│   │   ├── about.html
│   │   ├── contact.html
│   │   ├── login.html
│   │   ├── 404.html
│   │   ├── admin_login.html
│   │   ├── admin_page.html
│   │   └── dashboard/           # Pages dashboard
│   │       ├── dashboard.html
│   │       ├── batiment.html
│   │       ├── types.html
│   │       └── dpe.html
│   └── components/              # Composants réutilisables
│       └── sidebar/
│           └── sidebar.html
├── static/                      # Fichiers statiques (CSS, JS, images)
│   ├── css/                     # Feuilles de style
│   ├── js/                      # Scripts JavaScript
│   │   ├── controllers/         # Contrôleurs JS
│   │   └── services/            # Services (auth, etc.)
│   ├── data/                    # Données JSON
│   └── assets/                  # Images et médias
├── data/                        # Application de gestion des données
└── apps/                        # Applications supplémentaires

```

## 🚀 Installation et Configuration

### Prérequis

- Python 3.13+
- Django 6.0.1
- SQLite (inclus avec Python)

### Installation

1. **Cloner le projet**
```bash
cd "c:\Users\ntpar\Documents\Démarche\Tayier\formation_python_2025\projet renovationEnergitque\batiment-renovation-paris-main_tayier\batiment-renovation-paris-monta - Copie"
```

2. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

3. **Appliquer les migrations**
```bash
python manage.py migrate
```

4. **Créer un compte administrateur**
```bash
python create_admin.py
```

Identifiants par défaut :
- **Username:** `admin`
- **Email:** `admin@renovenergy.com`
- **Mot de passe:** `admin123`

5. **Lancer le serveur de développement**
```bash
python manage.py runserver 8001
```

## 🌐 URLs Disponibles

### URLs Production (Originales)
- **Accueil** : `http://127.0.0.1:8001/`
- **À propos** : `http://127.0.0.1:8001/about/`
- **Contact** : `http://127.0.0.1:8001/contact/`
- **Connexion** : `http://127.0.0.1:8001/login/`
- **Dashboard** : `http://127.0.0.1:8001/dashboard/`
- **Admin Django** : `http://127.0.0.1:8001/admin/`

### URLs V2 (Nouvelle Architecture - Test)
- **Accueil V2** : `http://127.0.0.1:8001/v2/`
- **À propos V2** : `http://127.0.0.1:8001/v2/about/`
- **Contact V2** : `http://127.0.0.1:8001/v2/contact/`
- **Dashboard V2** : `http://127.0.0.1:8001/v2/dashboard/`
- **Bâtiments V2** : `http://127.0.0.1:8001/v2/dashboard/batiment/`
- **Types V2** : `http://127.0.0.1:8001/v2/dashboard/types/`
- **DPE V2** : `http://127.0.0.1:8001/v2/dashboard/dpe/`

## 🎨 Technologies Utilisées

### Backend
- **Django 6.0.1** - Framework web Python
- **SQLite** - Base de données
- **Django Sessions** - Gestion des sessions utilisateur

### Frontend
- **HTML5** - Structure
- **CSS3** - Styles (Vanilla CSS + design system personnalisé)
- **JavaScript ES6** - Logique client
- **ApexCharts** - Bibliothèque de graphiques interactifs
- **Material Symbols** - Icônes Google

### Architecture
- **SPA (Single Page Application)** - Navigation fluide
- **Modular JavaScript** - ES6 Modules
- **Component-Based Templates** - Réutilisabilité
- **Neumorphism Design** - Style moderne

## 📊 Fonctionnalités

### Dashboard Interactif
- Visualisation des bâtiments rénovés (privés et sociaux)
- Analyse des types de travaux de rénovation
- Suivi des performances DPE (Diagnostic de Performance Énergétique)
- Graphiques interactifs (barres, donuts, listes)
- Filtrage par année (2021-2026)

### Gestion Utilisateurs
- Système d'authentification (connexion/inscription)
- Rôles utilisateurs (Admin, Éditeur, Lecteur)
- Page d'administration dédiée
- Gestion des sessions sécurisée

### Pages Informatives
- Page d'accueil avec présentation du projet
- Section "À propos" avec statistiques
- Formulaire de contact
- Page d'équipe

## 🔧 Configuration

### Fichiers Statiques

Les fichiers statiques sont configurés dans `settings.py` :

```python
STATIC_URL = 'static/'
STATICFILES_DIRS = [
    BASE_DIR / "static",
    BASE_DIR / "templates",
]
```

### Templates

Les templates sont organisés selon une architecture modulaire :

```python
TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [os.path.join(BASE_DIR, "templates")],
    "APP_DIRS": True,
    ...
}]
```

## 📝 Notes de Développement

### Architecture V2

La version V2 du projet utilise une architecture de templates améliorée :
- Séparation claire entre layouts, pages et composants
- Réutilisation maximale du code
- Meilleure maintenabilité
- CSS et JS correctement liés via `{% static %}`

### Données

Les données sont stockées dans des fichiers JSON dans `static/data/` :
- `stats_batiments.json` - Données des bâtiments rénovés
- `stats_types.json` - Types de travaux
- `stats_dpe.json` - Classifications DPE

### Scripts Utiles

- `create_admin.py` - Créer/réinitialiser le compte admin
- `manage.py migrate` - Appliquer les migrations de base de données
- `manage.py runserver 8001` - Lancer le serveur de développement

## 🐛 Dépannage

### Erreur "no such table: django_session"
```bash
python manage.py migrate
```

### CSS ne se charge pas
Vérifier que `STATICFILES_DIRS` est correctement configuré dans `settings.py`

### Mot de passe admin oublié
```bash
python create_admin.py
```

## 👥 Équipe

- **Sophie Martin** - Responsable QA
- **Thomas Dubois** - Chef de projet
- **Julien Lefevre** - Développeur Back-end
- **Nicolas Moreau** - Concepteur logiciel

## 📄 Licence

Projet éducatif - Formation Python 2025

---

**Version:** 2.0  
**Dernière mise à jour:** 28 janvier 2026
