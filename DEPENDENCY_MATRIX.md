# Matrice de Dépendances Inter-Repos

> **Document technique** — Mapping des dépendances entre les 5 repos
> **Auteur :** Tayierjiang Tayier — Architecte Logiciel Senior
> **Date :** Avril 2026

---

## 📊 Vue globale

| Depuis \ Vers | `backend` | `web-mvt` | `desktop-react` | `docs` | `archive` |
|---------------|-----------|-----------|-----------------|--------|-----------|
| **`backend`** | — | ❌ | ❌ | ✅ Réf | ✅ Réf |
| **`web-mvt`** | ✅ Runtime | — | ❌ | ✅ Réf | ❌ |
| **`desktop-react`** | ✅ Runtime | ❌ | — | ✅ Réf | ❌ |
| **`docs`** | ✅ Réf | ✅ Réf | ✅ Réf | — | ✅ Réf |
| **`archive`** | ❌ | ❌ | ❌ | ❌ | — |

> ✅ = Dépendance | ❌ = Indépendant | Réf = Référence documentaire (non bloquante)

---

## 🔌 Dépendances Runtime (bloquantes)

### 1. `web-mvt` → `backend`

| Aspect | Détail |
|--------|--------|
| **Type** | HTTP REST |
| **Mécanisme** | API Django `/api/dashboard/<filename>/` |
| **Consommé par** | `templates/` + `static/js/` (fetches ApexCharts) |
| **Contrat** | JSON |
| **Port** | `:8000` |
| **Sans cette dépendance** | UI sans données, charts vides |

**Configuration :**
```python
# backend/settings.py
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]
CORS_ALLOWED_ORIGINS = ["http://127.0.0.1:8000"]
```

---

### 2. `desktop-react` → `backend`

| Aspect | Détail |
|--------|--------|
| **Type** | HTTP REST |
| **Mécanisme** | API Django `/api/*` (proxy Vite configuré) |
| **Consommé par** | `react-app/src/api/*.js` |
| **Contrat** | JSON |
| **Port** | `:5174` (Vite) → `:8000` (backend) via proxy |
| **Sans cette dépendance** | React ne charge aucune donnée |

**Configuration Vite :**
```js
// vite.config.js
server: {
  port: 5174,
  proxy: {
    '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true }
  }
}
```

---

### 3. `web-mvt/launcher` → `web-mvt/ui`

| Aspect | Détail |
|--------|--------|
| **Type** | Embedded WebEngine |
| **Mécanisme** | PyQt6 `QWebEngineView` → charge `http://127.0.0.1:8000/dashboard/` |
| **Consommé par** | `app_launcher.py` |
| **Contrat** | HTML rendu par Django |
| **Sans cette dépendance** | Launcher ouvre une page vide |

---

### 4. `desktop-react/launcher` → `desktop-react/ui`

| Aspect | Détail |
|--------|--------|
| **Type** | Embedded WebEngine |
| **Mécanisme** | PyQt6 `QWebEngineView` → charge `http://localhost:5174/` |
| **Consommé par** | `app_launcher.py` (V2) |
| **Contrat** | HTML SPA React |
| **Sans cette dépendance** | Launcher V2 ouvre une page vide |

---

## 📚 Dépendances de Référence (non bloquantes)

### 5. `docs` → tous les repos

| Repo référencé | Fichier doc |
|----------------|-------------|
| `backend` | `data_intelligence/ARCHITECTURE_UNIVERSAL_DATA_PLATFORM.md` |
| `web-mvt` | `HISTORIQUE_DEVELOPPEMENT.md` |
| `desktop-react` | `data_intelligence/MIGRATION_NEXUS_V1_TO_V2.md` |
| `archive` | `data_intelligence/CAHIER_DES_CHARGES_DATA_V1.md` |

---

## ✅ Dépendances Outils/Build

| Repo | Dépendances Build | Gestionnaire |
|------|-------------------|--------------|
| `backend` | `Django 6.0.1`, `Pandas`, `NumPy`, `PyQt6` | `requirements.txt` |
| `web-mvt/ui` | Aucune (vanilla JS + CDN) | — |
| `web-mvt/launcher` | `PyQt6`, `PyQt6-WebEngine` | `requirements.txt` |
| `desktop-react/ui` | `React 18`, `Vite` | `package.json` |
| `desktop-react/launcher` | `PyQt6`, `PyQt6-WebEngine` | `requirements.txt` |
| `docs` | Aucune | — |
| `archive` | Aucune | — |

---

## 🧱 Contrat API — Fiabilité

```
┌──────────────────────────┐
│      CONTRAT /api/*      │
├──────────────────────────┤
│ GET  /api/dashboard/*/   │ → Données charts MVT
│ POST /api/datasets/upload│ → Upload CSV/Excel
│ POST /api/analyze        │ → Analyse data
│ POST /api/knowledge      │ → Knowledge manifest
│ POST /api/sidebar        │ → Sidebar génération
│ POST /api/filter         │ → Filtrage
│ POST /api/chart          │ → Chart data
│ POST /api/chat           │ → Chat KM-only
└──────────────────────────┘
```

> **Stabilité :** `web-mvt` et `desktop-react` doivent TOUJOURS consommer ce même contrat.

---

## 📈 Impact d'une modification

| Modif backend | Impact web-mvt | Impact desktop-react |
|---------------|----------------|----------------------|
| Nouvel endpoint API | ✅ Compatible | ✅ Compatible |
| Breaking change `/api/*` | ❌ UI cassée | ❌ UI cassée |
| Nouvelle route MVT | ✅ Pouvoir ajouter template | ❌ Non concerné |
| Changement data pipeline | ✅ Données mises à jour | ✅ Données mises à jour |

---

## 🔄 Cycle de Release

```
Backend release vX.Y.Z ──► API stable ──► web-mvt release
                                        └──► desktop-react release
```

**Règle :** Release backend d'abord, puis les UIs.

---

_Dernière mise à jour : Avril 2026 — Tayierjiang Tayier_