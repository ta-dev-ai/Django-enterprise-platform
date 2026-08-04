# Rapport de Test — Lanceurs V1 & V2

> **Validation du branchement des lanceurs**
> **Auteur :** Tayierjiang Tayier — Architecte Logiciel Senior
> **Date :** Avril 2026

---

## ✅ Résumé

**Les deux lanceurs sont correctement branchés et démarrent sans crash.**

| Lanceur | Statut | Détail |
|---------|--------|--------|
| **V1** (`DEMARRER.py`) | ✅ Fonctionnel | Fenêtre PyQt6 s'ouvre, Django répond HTTP 200 |
| **V2** (`1_CLIC_DEMARRER_V2.py`) | ✅ Fonctionnel | Django + React démarrent, process reste actif |
| **Backend** (`manage.py runserver`) | ✅ Fonctionnel | `http://127.0.0.1:8000/dashboard/` → HTTP 200 |

---

## 🧪 Tests effectués

### 1. Vérification backend
```
python manage.py check
→ System check identified no issues (0 silenced).
```
```
runserver 8000 + GET /dashboard/
→ HTTP Status: 200
```

### 2. Vérification des dépendances (scripts/test_launchers.py)
```
Django: ✅ OK        PyQt6: ✅ OK
PyQt6.WebEngine: ✅ OK   Pandas: ✅ OK   NumPy: ✅ OK
```

### 3. Vérification des chemins V1
```
DEMARRER.py                        → ✅ OK
RenovateApp_Launcher/app_launcher.py → ✅ OK
RenovateApp_Launcher/ui/launcher_ui.html → ✅ OK
RenovateApp_Launcher/requirements.txt  → ✅ OK
```

### 4. Vérification des chemins V2
```
app_launcher/1_CLIC_DEMARRER_V2.py → ✅ OK
app_launcher/.../ui2/react-app/    → ✅ OK
react-app/package.json             → ✅ OK
react-app/vite.config.js           → ✅ OK
react-app/node_modules/            → ✅ OK (présent)
```

### 5. Test réel de démarrage
```
Lanceur V1 (DEMARRER.py)
→ ✅ Process actif (PID 16968), fenêtre PyQt6 ouverte

Lanceur V2 (1_CLIC_DEMARRER_V2.py)
→ ✅ Process actif (PID 30684), Django + React en cours
```

---

## ⚠️ Bug latent identifié (non bloquant)

**Fichier :** `app_launcher/RenovateApp_Launcher_2/app_launcher.py`

Ce fichier est une **copie du V1** et référence `ui/` :
```python
UI_DIR = os.path.join(BASE_DIR, "ui")  # ← devrait être "ui2" pour le V2
```

**Impact :** AUCUN sur `1_CLIC_DEMARRER_V2.py` (le vrai point d'entrée V2 ne lance pas ce fichier — il démarre Django + React directement). Ce fichier est donc **orphelin / obsolète**.

**Recommandation :** à archiver dans `multi-repo-target/archive/obsolete/` lors de la prochaine réorganisation (selon la règle d'OR : archiver, jamais supprimer).

---

## 📋 Conclusion

La livraison est **fonctionnelle côté lancement** :

- ✅ `python DEMARRER.py` → Interface V1 (PyQt6)
- ✅ `python app_launcher/1_CLIC_DEMARRER_V2.py` → Interface V2 (Django + React)
- ✅ `http://127.0.0.1:8000/dashboard/` répond

Les tests prouvent que la séparation backend/frontend/desktop n'a pas cassé le branchement des lanceurs.

---

_Dernière mise à jour : Avril 2026 — Tayierjiang Tayier_