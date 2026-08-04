# Data Knowledge Manifest — Spécification

_Version 1.0 — Juillet 2026_  
**Artefact central V2** — anatomie d'un dataset **avant** visualisation, filtrage NL ou export.

> **Ne pas confondre** avec les JSON dashboard actuels (`table_financial.json`, etc.) ni `export_manifest` post-rapport.

---

## 1. Rôle

Le **Data Knowledge Manifest (DKM)** répond aux questions du [QUESTIONS_CATALOG_UNIVERSAL.md](./QUESTIONS_CATALOG_UNIVERSAL.md).  
Chaque service producteur écrit une **tranche** (`DataKnowledgeSlice`) ; `KnowledgeBuilder` fusionne le document racine.

**Invariants :**

| ID | Règle |
|----|-------|
| INV-01 | Le DKM existe **avant** tout chart ou filtre utilisateur |
| INV-02 | Le LLM / Chat reçoit **uniquement** le DKM (ou sous-ensemble), jamais les N lignes brutes |
| INV-03 | La sidebar UI est **dérivée** de `schema.columns[]` (voir [SIDEBAR_FILTER_SPEC.md](./SIDEBAR_FILTER_SPEC.md)) |
| INV-04 | `dkm_version` semver ; breaking change → bump majeur |

---

## 2. Schéma JSON v1 (complet)

```json
{
  "dkm_version": "1.0",
  "meta": {
    "dataset_id": "uuid",
    "filename": "ventes_2024.xlsx",
    "format": "xlsx",
    "sha256": "abc123...",
    "uploaded_at": "2026-07-12T08:00:00Z",
    "analyzed_at": "2026-07-12T08:00:12Z",
    "row_count": 10000,
    "column_count": 15,
    "memory_bytes": 2400000,
    "source": "user_upload",
    "domain_hint": null
  },
  "schema": {
    "columns": [
      {
        "name": "date_vente",
        "inferred_type": "datetime",
        "pandas_dtype": "datetime64[ns]",
        "nullable": true,
        "null_count": 12,
        "null_rate": 0.0012,
        "distinct_count": 365,
        "cardinality": "medium",
        "sample_values": ["2024-01-15", "2024-02-03"],
        "stats": {
          "min": "2022-01-01",
          "max": "2024-12-31"
        },
        "filter_widget": "date_range",
        "semantic_role": "time_dimension"
      },
      {
        "name": "montant",
        "inferred_type": "currency",
        "nullable": false,
        "null_rate": 0,
        "distinct_count": 8420,
        "cardinality": "high",
        "stats": { "min": 12.5, "max": 4500.0, "mean": 234.12, "median": 189.0 },
        "filter_widget": "numeric_range",
        "semantic_role": "measure"
      },
      {
        "name": "produit",
        "inferred_type": "category",
        "nullable": false,
        "null_rate": 0,
        "distinct_count": 45,
        "cardinality": "low",
        "top_values": [
          { "value": "Widget A", "count": 1200 },
          { "value": "Widget B", "count": 980 }
        ],
        "filter_widget": "multi_select",
        "semantic_role": "dimension"
      }
    ],
    "primary_key_candidate": ["numero_dpe"],
    "time_column_candidate": "date_vente",
    "measure_columns": ["montant"],
    "dimension_columns": ["produit", "region"]
  },
  "metrics": {
    "precomputed": true,
    "items": [
      {
        "id": "revenue_total",
        "label_fr": "Chiffre d'affaires total",
        "value": 1250000.5,
        "unit": "EUR",
        "source_columns": ["montant"],
        "aggregation": "sum"
      }
    ],
    "by_time": [],
    "rankings": []
  },
  "quality": {
    "confidence": 0.92,
    "needs_user_review": false,
    "review_threshold": 0.7,
    "duplicate_row_count": 0,
    "empty_column_names": 0,
    "ambiguous_columns": [],
    "validation": { "ok": true, "errors": [] },
    "breakdown": {
      "schema_confidence": 0.95,
      "type_inference_confidence": 0.88,
      "completeness_score": 0.99
    }
  },
  "insights": {
    "summary_fr": "10 000 lignes, 15 colonnes, période 2022–2024, CA total 1,25 M€, 45 produits.",
    "detected_domain": "sales",
    "suggested_questions": [
      "Quel est le CA par mois ?",
      "Quels produits vendent le plus ?"
    ]
  },
  "views": {
    "legacy_dashboard": null,
    "default_chart": {
      "type": "bar",
      "x": "produit",
      "y": "montant",
      "aggregation": "sum"
    }
  },
  "engines_trace": [
    { "service": "SchemaProfiler", "engine": "pandas", "at": "2026-07-12T08:00:05Z" },
    { "service": "TypeInferencer", "engine": "heuristic", "at": "2026-07-12T08:00:08Z" }
  ]
}
```

---

## 3. Types de colonnes (`inferred_type`)

| Type | Détection | Exemple |
|------|-----------|---------|
| `integer` | entiers | `quantity` |
| `float` | décimaux | `score` |
| `currency` | nom + symbole €/$ ou colonne `montant`, `prix` | `cout_total_5_usages` |
| `datetime` | parse dates > 80 % | `date_etablissement_dpe` |
| `category` | cardinality faible (< 50 distinct) | `etiquette_dpe` |
| `boolean` | true/false/0/1 | `actif` |
| `text` | longueur moyenne > 50 ou high cardinality | `adresse_brut` |
| `id` | quasi-unique, pattern UUID/code | `numero_dpe` |
| `geo` | code postal, lat/lon | `code_postal_ban` |
| `unknown` | non classifié | — |

---

## 4. Cardinalité → widget filtre

| `cardinality` | Condition | `filter_widget` |
|---------------|-----------|-----------------|
| `low` | distinct ≤ 50 | `multi_select` ou `chips` |
| `medium` | 51–500 | `search_select` |
| `high` | > 500 | `numeric_range`, `date_range`, ou `search_text` |

Détail complet : [SIDEBAR_FILTER_SPEC.md](./SIDEBAR_FILTER_SPEC.md).

---

## 5. DataKnowledgeSlice (tranche producteur)

Chaque service produit une ou plusieurs tranches avant fusion :

```json
{
  "knowledge_id": "DKN_COLUMN_SCHEMA",
  "family": "schema",
  "state": "detected",
  "payload": { "schema": { "columns": [] } },
  "producer_service": "SchemaProfiler",
  "confidence": 0.95,
  "dkm_paths": ["schema.columns"],
  "engine": "pandas"
}
```

États lifecycle : `raw` → `detected` → `validated` → `merged` → `scored` → `manifest` → `archived`.

---

## 6. Sous-ensemble LLM (`dkm_planner_subset`)

Champs **autorisés** pour le Chat Analyst (ADR-002) :

```text
dkm_version, meta (sans sha256 si token limit), schema.columns (sans sample_values longs),
metrics.precomputed, metrics.rankings, quality (confidence, needs_user_review),
insights.summary_fr, insights.suggested_questions
```

**Interdits** dans le contexte LLM :

```text
raw_rows, full_data, file_path_absolu, credentials
```

---

## 7. API (cible V2)

| Méthode | Route | Retour |
|---------|-------|--------|
| POST | `/api/datasets/upload` | `{ dataset_id }` |
| POST | `/api/datasets/{id}/analyze` | DKM complet |
| GET | `/api/datasets/{id}/knowledge` | DKM (manifest + slices_count) |
| POST | `/api/datasets/{id}/filter` | `{ filtered_preview, applied_filters }` |
| POST | `/api/datasets/{id}/chart` | `{ chart_spec, data }` |
| POST | `/api/datasets/{id}/chat` | `{ answer, citations[], chart? }` |

**Legacy V1 préservé :** `GET /api/dashboard/<filename>/` inchangé pour DPE.

---

## 8. Persistance

```text
data/datasets/{dataset_id}/
  source.xlsx          # fichier brut
  knowledge_manifest.json
  knowledge_slices.json
  snapshots/           # optionnel
```

---

## 9. Relation avec TableFactory (V1)

| V1 | V2 |
|----|-----|
| `config_data_DPE.json` colonnes fixes | `schema.columns` inféré |
| `meta.columns` + `data[][]` dans JSON | `views.legacy_dashboard` ou génération lazy |
| 6 fichiers `export_dashboard/` | **Vues dérivées** du DKM, pas source de vérité |

Voir [MIGRATION_NEXUS_V1_TO_V2.md](./MIGRATION_NEXUS_V1_TO_V2.md).

---

_Data Knowledge Manifest Spec v1 — TAYIER OS Data Intelligence_
