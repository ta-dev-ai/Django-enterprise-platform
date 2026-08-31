<div align="center">

# ⚡ RenovateEnergy Nexus 3D
### Plateforme Data Analytics, Visualisation 3D Urbaine & Transition Énergétique

![RenovateEnergy Nexus 3D Demo](docs/assets/demo_dashboard_3d.gif)

[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Django 6.0](https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![ECharts GL 3D](https://img.shields.io/badge/WebGL-ECharts_GL_3D-AA344D?style=for-the-badge&logo=webgl&logoColor=white)](https://echarts.apache.org/)
[![MCP Ready](https://img.shields.io/badge/MCP-Protocol_Ready-8B5CF6?style=for-the-badge&logo=openai&logoColor=white)](https://modelcontextprotocol.io/)

<p align="center">
  <b>Conçu et développé par <a href="https://www.linkedin.com/in/tayier-dev-ai-data/">Tayierjiang Tayier</a></b><br>
  <i>Lead Developer Full-Stack & Data Engineer · +30 Projets Réalisés</i>
</p>

---

**Statut du Projet :** `✅ Prototype Fonctionnel & Showcase Enterprise Terminé`  
**Cible Métier :** Analyse décisionnelle de plus de **750 000 Diagnostics de Performance Énergétique (DPE)** sur les 20 arrondissements de Paris.

</div>

---

## 📖 À Propos du Projet

Dans le cadre de la transition écologique et de l'éradication des passoires thermiques métropolitaines, la capacité à transformer des volumes massifs de données brutes en indicateurs spatiaux clairs est un levier stratégique décisif.

**RenovateEnergy Nexus 3D** est une plateforme analytique d'ingénierie et d'évaluation énergétique. Elle combine la robustesse d'un backend d'entreprise **Python / Django**, la réactivité d'un frontend **React 18**, et la puissance de rendu spatial de **WebGL / ECharts 3D** pour cartographier en direct le comportement thermique des bâtiments.

---

## 🏛️ L'Histoire & L'Évolution Architecturale

Le projet a franchi trois jalons technologiques majeurs :

```text
┌────────────────────────────────┐     ┌────────────────────────────────┐     ┌────────────────────────────────┐
│   PHASE 1 : FONDATION MVT      │ ──► │   PHASE 2 : MODERNISATION UI   │ ──► │   PHASE 3 : VISUALISATION 3D   │
│   • Django Monolithique MVT    │     │   • Découplage SPA React 18    │     │   • Moteur WebGL & ECharts GL  │
│   • Templates Jinja & HTML/JS  │     │   • Dashboard Bento Donut Grid │     │   • 7 Modèles 3D Métier        │
│   • Pipeline ETL Pandas/NumPy  │     │   • Mode Sombre / Clair        │     │   • Cadrage Haute Résolution   │
└────────────────────────────────┘     └────────────────────────────────┘     └────────────────────────────────┘
```

### 1. Phase 1 — Fondation Back-End & Architecture Django MVT
- Modélisation du socle de données avec Django ORM et SQLite/PostgreSQL.
- Traitement et agrégation analytique de **+750 000 DPE** via Pandas et NumPy.
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

## 🔮 Futures Évolutions & Roadmap R&D

Ce prototype fonctionnel constitue la fondation de futures avancées technologiques :

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 PROCHAINES ÉTAPES R&D                                  │
├──────────────────────────────┬──────────────────────────────┬──────────────────────────┤
│ 🤖 AGENTS IA AUTONOMES       │ 🔌 SERVEURS MCP PROTOCOL     │ 🌐 MOTEUR DATA AGNOSTIQUE│
│ • Pilotage par LLM           │ • Connecteurs Open Data      │ • Généralisation à tout  │
│ • Recommandation de travaux  │ • Interrogation temps réel   │   dataset territorial    │
│ • Audit prédictif thermique  │ • ADEME, Cadastre, Météo     │ • Logistique, Immobilier │
└──────────────────────────────┴──────────────────────────────┴──────────────────────────┘
```

1. **🤖 Pilotage par Intelligence Artificielle & Automatisation** :
   - Intégration d'agents conversationnels et d'automatisation pour orchestrer les scénarios de rénovation.
   - Génération automatisée de bilans thermiques prédictifs et calcul du ROI énergétique via des modèles LLM spécialisés.

2. **🔌 Intégration de Serveurs MCP (Model Context Protocol)** :
   - Déploiement de connecteurs standardisés **MCP** permettant aux agents IA d'interroger directement des sources externes hétérogènes (API Open Data de l'ADEME, bases du cadastre solaire, API Météo France, registres fonciers).
   - Recherche et enrichissement dynamique sans dépendance à un dataset statique.

3. **🌐 Généralisation Data Agnostique Multi-Domaines** :
   - Évolution du moteur 3D pour ingérer et modéliser **n'importe quel jeu de données tabulaire ou géographique** (logistique urbaine, flux de transport, démographie, réseaux intelligents) sans se limiter au DPE.

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
  <sub>Projet développé avec passion dans le cadre de la transition écologique et des technologies de pointe.</sub>
</div>
