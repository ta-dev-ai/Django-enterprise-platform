# Archive - Lanceurs Legacy

Cette archive contient les anciens fichiers de lanceur qui ont été remplacés par la version simplifiée.

## 📅 Date d'archivage
Avril 2026

## 📝 Raison de l'archivage

Ces fichiers ont été déplacés dans l'archive pour les raisons suivantes :

1. **Simplification de l'architecture** : Le projet utilisait deux lanceurs différents (simple et unifié), ce qui créait de la confusion.

2. **Fichiers actifs conservés dans `launcher/`** :
   - `simple_launcher.py` - Serveur HTTP léger (sans PyQt6)
   - `simple_ui.html` - Interface web
   - `simple_ui.mjs` - Logique JavaScript
   - `start.bat` - Point d'entrée principal

3. **Problème corrigé** : Le chemin `REACT_DIR` dans `simple_launcher.py` a été corrigé (ligne 35) :
   - ❌ Avant : `REACT_DIR = ROOT_DIR / "desktop-react" / "ui" / "react-app"`
   - ✅ Après : `REACT_DIR = ROOT_DIR / "desktop-react" / "ui"`

## 📦 Contenu de l'archive

### `unified_launcher.py` (497 lignes)
- Lanceur PyQt6 avec QWebEngineView
- Utilise QWebChannel pour la communication Python ↔ JavaScript
- Interface plus complexe avec logs en temps réel
- **Raison de l'archivage** : Remplacé par la version simple sans dépendance PyQt6

### `unified_ui.html` (160 lignes)
- Interface HTML pour unified_launcher.py
- Utilise `onclick="window.location.href='...'"` pour les boutons
- **Raison de l'archivage** : Dépend de unified_launcher.py

### `qwebchannel.js` (181 lignes)
- Librairie Qt pour la communication entre Python et JavaScript
- Utilisée uniquement par unified_launcher.py
- **Raison de l'archivage** : Dépendance de unified_launcher.py uniquement

## 🔄 Comment restaurer ces fichiers (si nécessaire)

Si vous avez besoin de restaurer ces fichiers :

```bash
# Copier les fichiers depuis l'archive vers le dossier launcher/
copy archive\launcher-legacy\unified_launcher.py launcher\
copy archive\launcher-legacy\unified_ui.html launcher\
copy archive\launcher-legacy\qwebchannel.js launcher\
```

**Note** : Le lanceur unifié nécessite PyQt6 et PyQt6-WebEngine :
```bash
pip install PyQt6 PyQt6-WebEngine
```

## 📚 Historique

- **Avril 2026** : Archivage des fichiers unified_* vers cette archive
- **Avril 2026** : Correction du chemin REACT_DIR dans simple_launcher.py

## 👤 Auteur
Tayierjiang Tayier — Architecte Logiciel Senior