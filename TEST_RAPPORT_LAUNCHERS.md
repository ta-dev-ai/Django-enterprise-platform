# Rapport d'Unification Finale des Lanceurs

## Contexte
Le projet possédait historiquement plusieurs lanceurs concurrents :
1. **PyQt6 V1** (`web-mvt/launcher/`) : dédié aux templates Django MVT.
2. **PyQt6 V2** (`desktop-react/launcher/`) : dédié à la coquille hybride React.
3. **Legacy Unified** (`archive/launcher-legacy/unified_launcher.py`) : basé sur PyQt6-WebEngine, sujet à des problèmes de synchronisation DOM/JS et des dépendances C++ instables.

## Solution Unifiée (Avril / Août 2026)
Unification définitive sous une **interface graphique web unique**, ultra-légère et résiliente, pilotée par un serveur Python HTTP natif sans aucune dépendance PyQt6.

### Fichiers du Lanceur Unifié
| Fichier | Rôle |
|---------|------|
| `start.bat` | Point d'entrée principal unique en double-clic |
| `launcher/simple_launcher.py` | Serveur de contrôle Python (`http.server` multi-threadé) avec gestion de ports automatique et API REST |
| `launcher/simple_ui.html` | Interface graphique moderne (Glassmorphism, Dark mode, CSS personnalisé) |
| `launcher/simple_ui.mjs` | Module ES6 de pilotage asynchrone (`fetch()`) avec logs en direct et badges d'état |

### Architecture Unifiée
```
start.bat
  └─ python launcher/simple_launcher.py  (serveur HTTP :5000 / auto-bind)
       ├─ GET  /                          → Sert le portail de contrôle unifié
       ├─ GET  /simple_ui.mjs            → Module JS de pilotage
       ├─ GET  /api/status               → {django, react_dev, react_preview, node, deploy_info, ports}
       ├─ POST /api/start-django         → Démarre Django Backend & Web MVT (:8000)
       ├─ POST /api/stop-django          → Arrête le serveur Django
       ├─ POST /api/start-react-dev      → Démarre React Vite Dev avec HMR (:5174)
       ├─ POST /api/start-react-preview  → Démarre le serveur statique de preview du build
       ├─ POST /api/stop-react           → Arrête les processus React
       ├─ POST /api/build-react          → Compile React en bundle de production (dist/)
       └─ POST /api/open-url             → Ouvre une URL dans le navigateur par défaut
```

### Archivage des Anciens Lanceurs
Conformément à la règle de gouvernance (`CONTEXT_RULES.md`), les anciens lanceurs ont été archivés sans perte de données :
- `web-mvt/launcher/` ➔ `archive/lanceurs-obsoletes/web-mvt-launcher-pyqt6/`
- `desktop-react/launcher/` ➔ `archive/lanceurs-obsoletes/desktop-react-launcher-pyqt6/`
