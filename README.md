# DataPilot

**MVP d'analyse et visualisation de données** — Django + React.

Premier cas d'usage intégré : diagnostics énergétiques (DPE) — Paris, 20 arrondissements.

---

## Démarrer (Windows)

1. Cloner le dépôt
2. **Double-clic sur `start.bat`**
3. Ouvrir l'interface dans le navigateur (proposé automatiquement)

```bash
git clone https://github.com/ta-dev-ai/Django-enterprise-platform.git
cd Django-enterprise-platform
start.bat
```

## Démarrer (ligne de commande)

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
python launcher/simple_launcher.py
```

L'interface React est servie sur **http://localhost:5175/** (API Django sur **http://127.0.0.1:8000/**).

---

## Prérequis

- Python 3.12+
- Node.js 18+ (pour le front React, installé au premier lancement)

---

## Auteur

[Tayierjiang Tayier](https://www.linkedin.com/in/tayier-dev-ai-data/) — [GitHub](https://github.com/ta-dev-ai)
