# Rapport de Test des Lanceurs

## Contexte
Le lanceur original (`unified_launcher.py`) utilisait **PyQt6 + QWebEngineView** pour afficher une interface HTML.
Il plantait car les appels `runJavaScript()` vers `window.appendLog`, `window.setStatus`, `window.setDeployInfo`
échouaient — les fonctions JavaScript n'étaient pas encore définies au moment de l'appel (problème de synchronisation
entre le thread Python et le chargement du DOM).

## Solution : Remplacement par un serveur HTTP Python + HTML/MJS

### Fichiers créés/modifiés
| Fichier | Action | Description |
|---------|--------|-------------|
| `launcher/simple_launcher.py` | **Créé** | Serveur HTTP Python léger (`http.server`) avec API REST |
| `launcher/simple_ui.html` | **Créé** | Interface HTML/CSS (même design que l'original) |
| `launcher/simple_ui.mjs` | **Créé** | Module JavaScript ES6 (communication via `fetch()`) |
| `start.bat` | **Modifié** | Lance `python launcher\simple_launcher.py` au lieu de `unified_launcher.py` |

### Architecture
```
start.bat
  └─ python launcher\simple_launcher.py  (serveur HTTP :5000)
       ├─ GET  /                  → sert simple_ui.html
       ├─ GET  /simple_ui.mjs    → sert le module JS
       ├─ GET  /api/status       → {django, react, node}
       ├─ GET  /api/deploy-info  → {exists, date}
       ├─ POST /api/start-django → démarre Django (:8000)
       ├─ POST /api/start-react-dev     → démarre React dev (:5174)
       ├─ POST /api/start-react-preview → démarre React preview (:5174)
       └─ POST /api/open-url     → ouvre une URL dans le navigateur
```

### Tests effectués
- ✅ `start.bat` démarre le serveur et ouvre le navigateur
- ✅ `GET /api/status` → `{"django": true, "react": false, "node": true}`
- ✅ `GET /api/deploy-info` → `{"exists": true, "date": "04/08/2026 12:10"}`
- ✅ `GET /` → HTML servi (5943 bytes, status 200)
- ✅ `GET /simple_ui.mjs` → JS module servi (10287 bytes, status 200)
- ✅ `POST /api/start-django` → `{"success": true, "message": "Django server starting..."}`
- ✅ Aucune dépendance PyQt6/QWebEngine requise

### Avantages de la nouvelle solution
- **Pas de PyQt6** : utilise uniquement la bibliothèque standard Python (`http.server`)
- **Pas de problème de synchronisation JS** : la communication se fait via `fetch()` (API HTTP)
- **Interface ouverte dans le navigateur** : pas besoin de QWebEngineView
- **MJS (ES6 modules)** : JavaScript moderne, maintenable
- **Moins de dépendances** : pas besoin de `PyQt6-WebEngine`
