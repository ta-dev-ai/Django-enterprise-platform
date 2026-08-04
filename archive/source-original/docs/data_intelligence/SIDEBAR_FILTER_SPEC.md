# Sidebar — Spécification filtres dynamiques

_Version 1.0 — Juillet 2026_  
**Contrat UI** entre `schema.columns[]` (DKM) et composants filtre React/JS.

---

## 1. Principe

La sidebar **n'est jamais codée en dur** par dataset. Elle est **générée** à partir du Data Knowledge Manifest après `analyze_dataset`.

```text
schema.columns[]
  → filter_widget par colonne
  → composant UI
  → POST /api/datasets/{id}/filter { filters: {...} }
  → refresh chart + table
```

---

## 2. Mapping `inferred_type` + `cardinality` → `filter_widget`

| inferred_type | cardinality | filter_widget | Composant UI |
|---------------|-------------|---------------|--------------|
| `datetime` | any | `date_range` | Double date picker (min–max depuis stats) |
| `integer`, `float`, `currency` | high | `numeric_range` | Slider dual + inputs min/max |
| `integer`, `float`, `currency` | low/medium | `numeric_range` | idem |
| `category`, `boolean` | low (≤ 50) | `multi_select` | Checkboxes ou select multiple |
| `category` | medium (51–500) | `search_select` | Autocomplete multi |
| `text` | high | `search_text` | Input contains / starts with |
| `text` | low | `multi_select` | Si top_values ≤ 50 |
| `id` | high | `search_text` | Recherche exacte / prefix |
| `geo` | low/medium | `multi_select` | Codes postaux, régions |
| `unknown` | any | `null` | Pas de filtre sidebar (exclu) |

**Règle :** si `null_rate > 0.95` → exclure de la sidebar (colonne vide).

---

## 3. Structure JSON sidebar (API → front)

```json
{
  "filters": [
    {
      "column": "produit",
      "label_fr": "Produit",
      "widget": "multi_select",
      "options": [
        { "value": "Widget A", "count": 1200 },
        { "value": "Widget B", "count": 980 }
      ],
      "default": null
    },
    {
      "column": "date_vente",
      "label_fr": "Date vente",
      "widget": "date_range",
      "bounds": { "min": "2022-01-01", "max": "2024-12-31" },
      "default": null
    },
    {
      "column": "montant",
      "label_fr": "Montant",
      "widget": "numeric_range",
      "bounds": { "min": 12.5, "max": 4500.0 },
      "default": null
    }
  ]
}
```

**Endpoint :** `GET /api/datasets/{id}/sidebar` — dérivé du DKM (pas de stockage séparé).

---

## 4. Payload filtre appliqué (client → serveur)

```json
{
  "filters": {
    "produit": { "op": "in", "values": ["Widget A"] },
    "date_vente": { "op": "between", "min": "2024-01-01", "max": "2024-12-31" },
    "montant": { "op": "between", "min": 100, "max": 500 }
  }
}
```

### Opérateurs supportés

| Op | Widget | Description |
|----|--------|-------------|
| `in` | multi_select | Valeurs dans liste |
| `not_in` | multi_select | Exclusion |
| `between` | date_range, numeric_range | Intervalle inclusif |
| `contains` | search_text | Sous-chaîne case-insensitive |
| `eq` | search_text (id) | Égalité |
| `is_null` | — | Valeurs manquantes |
| `is_not_null` | — | Valeurs présentes |

---

## 5. Ordre sidebar

1. Colonnes `dimension` et `category` en premier (filtrage métier)
2. Colonnes `time_dimension` 
3. Colonnes `measure` (numeric_range) en dernier
4. Tri alphabétique dans chaque groupe

---

## 6. Labels français

| Règle | Exemple |
|-------|---------|
| `name` snake_case → Title | `code_postal_ban` → « Code postal » |
| Override optionnel `column_labels` dans DKM | `cout_total_5_usages` → « Coût énergie annuel » |

Heuristiques domaine DPE : voir [QUESTIONS_CATALOG_DPE.md](./QUESTIONS_CATALOG_DPE.md).

---

## 7. Comportement UX

| Comportement | Valeur |
|--------------|--------|
| Debounce envoi filtre | 300 ms |
| Indicateur lignes match | « 2 340 / 10 000 lignes » |
| Reset | Bouton « Effacer filtres » |
| URL state | Query params optionnels `?produit=A&date_from=...` |
| Mobile | Sidebar drawer overlay |

---

## 8. IA discrète (enrichissement sidebar)

Services **sans bloquer** l'affichage initial :

| Enrichissement | Source | Affichage |
|----------------|--------|-----------|
| Suggestion filtre pertinent | InsightComposer | Badge « Suggéré » sur 1–2 colonnes |
| Alerte qualité | `quality.ambiguous_columns` | Icône ⚠ sur colonne |
| Domaine détecté | `insights.detected_domain` | Preset filtres DPE/ventes |

**80 % auto :** sidebar complète dès `analyzed`.  
**20 % :** modal si `needs_user_review` sur type colonne.

---

## 9. Régression V1 DPE

Mapping filtres actuels `mainController.filters` → sidebar V2 :

| V1 (mainController) | Colonne DPE | Widget V2 |
|---------------------|-------------|-----------|
| `batiment.year` | année (calculée) | `multi_select` |
| `types.type` | type travaux | `multi_select` |
| `dpe.class` | `etiquette_dpe` | `chips` A–G |

Les controllers `buildingController.js`, `dpeController.js`, `typesController.js` deviennent **thin wrappers** sur FilterEngine générique en V2.

---

## 10. Tests d'acceptation sidebar

| ID | Test |
|----|------|
| SB-01 | CSV 5 colonnes → 5 widgets sans config manuelle |
| SB-02 | Colonne 3 valeurs distinctes → multi_select 3 options |
| SB-03 | Filtre `between` dates → row_count diminue |
| SB-04 | Colonne 100 % null → absente sidebar |
| SB-05 | DPE : etiquette_dpe → chips A–G |

---

_Sidebar Filter Spec v1 — contrat UI/API_
