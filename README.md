<div align="center">

# ⚡ RenovateEnergy Nexus 3D
### Plateforme Data Analytics, Visualisation 3D Spatiale & Intelligence Artificielle

![RenovateEnergy Nexus 3D Demo](docs/assets/demo_dashboard_3d.gif)

[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Django 6.0](https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![ECharts GL 3D](https://img.shields.io/badge/WebGL-ECharts_GL_3D-AA344D?style=for-the-badge&logo=webgl&logoColor=white)](https://echarts.apache.org/)
[![Desktop PyQt6](https://img.shields.io/badge/Desktop-PyQt6_Ready-41CD52?style=for-the-badge&logo=qt&logoColor=white)](https://riverbankcomputing.com/software/pyqt/)
[![MCP Ready](https://img.shields.io/badge/MCP-Protocol_Ready-8B5CF6?style=for-the-badge&logo=openai&logoColor=white)](https://modelcontextprotocol.io/)

<p align="center">
  <b>Conçu et développé par <a href="https://www.linkedin.com/in/tayier-dev-ai-data/">Tayierjiang Tayier</a></b><br>
  <i>Lead Developer Full-Stack & Data Engineer · +30 Projets Réalisés</i>
</p>

---

**Statut du Projet :** `✅ Prototype Fonctionnel & Showcase Enterprise Réussi`  
**Données Exploitées :** Données Open Source officielles de la **Rénovation Énergétique de Paris (2020 – 2026)** couvrant plus de **750 000 Diagnostics de Performance Énergétique (DPE)**.

</div>

---

## 📖 Présentation du Projet

Dans le cadre de la transition écologique métropolitaine, **RenovateEnergy Nexus 3D** prouve la faisabilité d'un système décisionnel de haute précision capable d'ingérer, d'agréger et de projeter dans l'espace 3D des millions de points de données énergétiques réels.

Le prototype actuel analyse en profondeur les données historiques et prévisionnelles de **Paris de 2020 à 2026** sur les 20 arrondissements, en combinant :
- Un socle d'entreprise **Python / Django**,
- Une interface réactive **React 18 & Tailwind**,
- Un moteur spatial **WebGL / ECharts 3D**,
- Un client Desktop **PyQt6**.

---

## 🏛️ Trajectoire & Évolution Architecturale

```text
┌────────────────────────────────┐     ┌────────────────────────────────┐     ┌────────────────────────────────┐
│   PHASE 1 : FONDATION MVT      │ ──► │   PHASE 2 : MODERNISATION UI   │ ──► │   PHASE 3 : VISUALISATION 3D   │
│   • Django Monolithique MVT    │     │   • Découplage SPA React 18    │     │   • Moteur WebGL & ECharts GL  │
│   • Templates Jinja & HTML/JS  │     │   • Dashboard Bento Donut Grid │     │   • 7 Modèles 3D Métier        │
│   • Données Réelles 2020-2026  │     │   • Mode Sombre / Clair        │     │   • Écran 3D Haute Résolution  │
└────────────────────────────────┘     └────────────────────────────────┘     └────────────────────────────────┘
```

### 1. Phase 1 — Fondation Back-End & Architecture Django MVT
- Modélisation du socle de données avec Django ORM et SQLite/PostgreSQL.
- Traitement et agrégation analytique de **+750 000 DPE (2020-2026)** via Pandas et NumPy.
- Première interface serveur en templates Django MVT sécurisée (Auth, Sessions, CSRF).

### 2. Phase 2 — Modernisation Front-End (SPA React 18 & Vite)
- Migration vers une architecture découplée avec API REST interne (`/api/dashboard/*`).
- Interface utilisateur haute fidélité avec **Dashboard Bento Split** (graphiques Donut synchronisés avec des légendes interactives).
- Barre de contrôle unifiée : sélection temporelle, filtres multicritères et exports de données en direct (**CSV avec encodage BOM**, **JSON**, et **PDF imprimable**).
- Support natif du **Dark Mode** (*Thème Midnight*).

### 3. Phase 3 — Rendu Spatial & Visualisation 3D Immersive (WebGL)
- Intégration d'un canevas 3D de **680px** à haute fréquence sans surcharge CPU/GPU.
- **7 Modèles 3D** intégrés avec réinitialisation propre sans superposition (`notMerge: true`) :
  1. 📊 **Histogramme 3D Classique** : Les 20 arrondissements de Paris alignés selon les volumes de DPE.
  2. 🔮 **Mandelbulb 3D & Bulles** : Nuage de sphères volumiques proportionnelles aux gisements d'énergie.
  3. 📊 **Matrice 3D DPE (Classes A–G)** : Grille des 7 classes énergétiques officielles ADEME par quartier.
  4. 🏢 **Comparatif 3D Privé vs Social** : Double colonne distinguant les logements privés et les bailleurs sociaux.
  5. 🗺️ **Relief Spatial Paris 1-20 (Escargot Urbain)** : Positionnement géographique réel en spirale.
  6. 🌊 **Surface Topologique** : Nappe thermique continue du relief énergétique métropolitain.
  7. 🌪️ **Attracteur de Lorenz 3D** : Simulation dynamique chaotique pour la modélisation prédictive R&D.

---

## 🔮 Les 2 Grandes Évolutions Majeures (Roadmap Vision)

Le prototype fonctionnel actuel valide la stack technique et ouvre la voie à **deux axes d'innovation stratégiques** :

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          LES 2 GRANDS AXES D'ÉVOLUTION FUTURE                          │
├────────────────────────────────────────────┬───────────────────────────────────────────┤
│ 🤖 AXE 1 : PILOTAGE IA EN LANGAGE NATUREL  │ 🌐 AXE 2 : MOTEUR UNIVERSEL DATA AGNOSTIQUE│
│            & PROTOCOLE MCP                 │            + CLIENT DESKTOP HYBRIDE       │
│ • Interrogation en langage naturel (LLM)   │ • Ingestion de n'importe quel dataset     │
│ • Connecteurs MCP Open Data & Multi-Sources│   (Scientifique, Public, Privé)           │
│ • Audit & Recommandation prédictive auto   │ • Application Desktop IA (PyQt6 / WebEngine)│
│ • Enrichissement temps réel (ADEME, Météo) │ • Détection & modélisation 3D automatique │
└────────────────────────────────────────────┴───────────────────────────────────────────┘
```

### 🤖 Axe 1 : Pilotage par Intelligence Artificielle en Langage Naturel & Serveurs MCP
- **Interrogation en Langage Naturel :** L'utilisateur pourra piloter l'intégralité du dashboard en formulant des requêtes conversationnelles (ex: *« Isole les passoires thermiques F/G de l'Est parisien et génère un scénario d'isolation avec estimation du gain énergétique »*).
- **Intégration du Protocole MCP (Model Context Protocol) :** Déploiement de serveurs MCP pour connecter dynamiquement l'application à des sources de données ouvertes hétérogènes (API Open Data de l'ADEME, cadastre solaire, données météorologiques, registres fonciers) sans aucune limitation à un dataset statique.

### 🌐 Axe 2 : Moteur Universel Data Agnostique & Application Desktop Dédiée
- **Généralisation à Tout Type de Données :** La plateforme évoluera pour devenir un moteur d'analytique universel capable d'importer, de structurer et de modéliser en 3D **n'importe quel dataset** (données scientifiques complexes, data d'entreprises privées, statistiques publiques, logistique urbaine, santé ou finance).
- **Collaboration Humain-IA :** L'intelligence artificielle analysera automatiquement les colonnes et distributions de n'importe quel fichier importé pour proposer instantanément le meilleur modèle de visualisation 3D adapté à la problématique métier.
- **Déploiement Desktop App (PyQt6) :** Version logicielle locale autonome permettant de traiter et visualiser de volumineux jeux de données en toute confidentialité, sans dépendre exclusivement d'un navigateur web.

---

## 🛠️ Stack Technique

### Back-End & Data Engineering
- **Langage :** Python 3.12+
- **Framework Web :** Django 6.0.1 (Architecture Enterprise & API REST)
- **Data Processing :** Pandas, NumPy, TableFactory Engine
- **Base de Données :** SQLite / PostgreSQL

### Front-End & Dataviz
- **Framework UI :** React 18, Vite 5.4
- **Visualisation 3D :** ECharts-GL, WebGL
- **Graphiques 2D :** ApexCharts (Donut Split Bento, Barres groupées)
- **Design & Styling :** Vanilla CSS3 modulaire, Tailwind CSS, Dark/Light Mode
- **Icônes & Typographie :** Google Fonts (Inter, Poppins), Material Symbols

### Desktop & Protocoles
- **Desktop Launcher :** PyQt6, PyQt6-WebEngine
- **Architecture IA :** Model Context Protocol (MCP Ready)

---

## 🚀 Démarrage Rapide

### 1. Cloner le Dépôt
```bash
git clone https://github.com/ta-dev-ai/Django-enterprise-platform.git
cd Django-enterprise-platform
```

### 2. Lancer le Back-End Django
```bash
# Créer et activer l'environnement virtuel
python -m venv .venv
source .venv/bin/activate  # ou .venv\Scripts\activate sous Windows

# Installer les dépendances Python
pip install -r requirements.txt

# Lancer le serveur Django
python manage.py runserver 8000
# → API & Serveur disponibles sur http://127.0.0.1:8000/
```

### 3. Lancer l'Application Front-End React
```bash
cd desktop-react/ui/react-app
npm install
npm run dev
# → Application interactive disponible sur http://localhost:5175/
```

---

## 👤 Auteur & Contact

**Tayierjiang Tayier**  
*Lead Developer Full-Stack · Data Engineer & AI Specialist*  
- 💼 **LinkedIn :** [linkedin.com/in/tayier-dev-ai-data](https://www.linkedin.com/in/tayier-dev-ai-data/)  
- 🐙 **GitHub :** [github.com/ta-dev-ai](https://github.com/ta-dev-ai)  

---

<div align="center">
  <sub>Prototype développé dans le cadre de la transition écologique, de l'ingénierie logicielle avancée et de l'intelligence artificielle appliquée.</sub>
</div>
