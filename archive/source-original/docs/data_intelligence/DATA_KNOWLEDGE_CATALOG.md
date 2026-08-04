# Data Knowledge Catalog — Types `DKN_*`

_Version 1.0 — Juillet 2026_  
**Colonne vertébrale ontologique** — chaque type répond à des questions du [QUESTIONS_CATALOG_UNIVERSAL.md](./QUESTIONS_CATALOG_UNIVERSAL.md).

> **Référence :** SNORBIK Cut `KNOWLEDGE_CATALOG_V3.md` — même structure, domaine tabulaire.

---

## 1. Principe

Chaque type de connaissance (`DKN_*`) est un **objet métier** :

| Attribut | Rôle |
|----------|------|
| `knowledge_id` | Identifiant stable (`DKN_COLUMN_SCHEMA`) |
| `family` | Domaine (meta, schema, metric, quality…) |
| `question_ids` | Questions auxquelles il répond |
| `dkm_paths` | Chemins JSON dans le Manifest |
| `producer_service` | Service producteur |
| `depends_on` | Types amont |
| `phase` | Jalons A–D |
| `code` | `✅` livré · `🔶` partiel · `⏳` spec |

**Exemple canonique :**

```text
Q_SCHEMA_02 : Quel type par colonne ?
  → DKN_COLUMN_TYPE (ColumnTypeKnowledge)
  → TypeInferencer
  → pandas dtype heuristics
  → DKM: schema.columns[].inferred_type
```

---

## 2. Knowledge Lifecycle

```text
Raw          — fichier bytes / DataFrame brut (jamais exposé LLM)
  ↓
Detected     — sortie service (types, stats)
  ↓
Validated    — règles métier (seuils null, cardinality)
  ↓
Merged       — KnowledgeBuilder fusionne tranches
  ↓
Scored       — quality.confidence
  ↓
Manifest     — knowledge_manifest.json
  ↓
Archived     — snapshot dataset job
```

---

## 3. Catalogue des types

### 3.1 Meta (`DKN_META_*`)

| ID | Type | Questions | DKM path | Service | Phase |
|----|------|-----------|----------|---------|-------|
| DKN_META_FILE | FileMetaKnowledge | Q_META_01 | `meta.filename`, `meta.format` | DatasetLoader | A |
| DKN_META_SHAPE | DatasetShapeKnowledge | Q_META_02–03 | `meta.row_count`, `meta.column_count` | DatasetLoader | A |
| DKN_META_HASH | ContentHashKnowledge | Q_META_05 | `meta.sha256` | DatasetLoader | A |
| DKN_META_JOB | DatasetContextKnowledge | Q_META_06 | `meta.dataset_id`, `meta.analyzed_at` | KnowledgeBuilder | A |

### 3.2 Schema (`DKN_SCHEMA_*`)

| ID | Type | Questions | DKM path | Service | Phase |
|----|------|-----------|----------|---------|-------|
| DKN_COLUMN_SCHEMA | ColumnSchemaKnowledge | Q_SCHEMA_01 | `schema.columns[].name` | SchemaProfiler | A |
| DKN_COLUMN_TYPE | ColumnTypeKnowledge | Q_SCHEMA_02 | `schema.columns[].inferred_type` | TypeInferencer | A |
| DKN_COLUMN_NULLS | NullProfileKnowledge | Q_SCHEMA_03 | `schema.columns[].null_rate` | SchemaProfiler | A |
| DKN_COLUMN_CARDINALITY | CardinalityKnowledge | Q_SCHEMA_04–05 | `cardinality`, `top_values` | CardinalityAnalyzer | A |
| DKN_COLUMN_STATS | NumericStatsKnowledge | Q_STAT_01–02 | `schema.columns[].stats` | NumericStatsEngine | A |
| DKN_SCHEMA_ROLES | SemanticRolesKnowledge | Q_SCHEMA_06–09 | `primary_key_candidate`, `measure_columns`… | TypeInferencer | A |
| DKN_FILTER_WIDGET | FilterWidgetKnowledge | Q_SCHEMA_10 | `schema.columns[].filter_widget` | SidebarGenerator | B |

### 3.3 Metrics (`DKN_METRIC_*`)

| ID | Type | Questions | DKM path | Service | Phase |
|----|------|-----------|----------|---------|-------|
| DKN_METRIC_SUMMARY | SummaryMetricKnowledge | Q_STAT_03 | `metrics.items[]` | MetricAggregator | A |
| DKN_METRIC_TIME_SERIES | TimeSeriesKnowledge | Q_TIME_02–03 | `metrics.by_time[]` | MetricAggregator | B |
| DKN_METRIC_RANKING | RankingKnowledge | Q_NL_* | `metrics.rankings[]` | MetricAggregator | B |
| DKN_METRIC_DISTRIBUTION | DistributionKnowledge | Q_STAT_04 | `metrics.distributions[]` | MetricAggregator | B |

### 3.4 Quality (`DKN_QUAL_*`)

| ID | Type | Questions | DKM path | Service | Phase |
|----|------|-----------|----------|---------|-------|
| DKN_QUAL_VALIDATION | DatasetValidationKnowledge | Q_QUAL_01 | `quality.validation` | QualityAnalyzer | A |
| DKN_QUAL_DUPLICATES | DuplicateKnowledge | Q_QUAL_02 | `quality.duplicate_row_count` | QualityAnalyzer | A |
| DKN_QUAL_CONFIDENCE | ConfidenceKnowledge | Q_QUAL_04 | `quality.confidence` | QualityAnalyzer | A |
| DKN_QUAL_REVIEW | NeedsReviewKnowledge | Q_QUAL_03 | `quality.needs_user_review` | QualityAnalyzer | A |
| DKN_QUAL_AMBIGUITY | AmbiguousColumnKnowledge | Q_QUAL_05 | `quality.ambiguous_columns` | TypeInferencer | A |

### 3.5 Insights (`DKN_INS_*`)

| ID | Type | Questions | DKM path | Service | Phase |
|----|------|-----------|----------|---------|-------|
| DKN_INS_SUMMARY | TextSummaryKnowledge | Q_INS_01 | `insights.summary_fr` | InsightComposer | A |
| DKN_INS_DOMAIN | DomainHintKnowledge | Q_INS_02 | `insights.detected_domain` | DomainClassifier | A |
| DKN_INS_SUGGESTIONS | SuggestedQuestionsKnowledge | Q_INS_03 | `insights.suggested_questions` | InsightComposer | C |
| DKN_INS_DEFAULT_CHART | DefaultChartKnowledge | Q_INS_04 | `views.default_chart` | ChartRecommender | B |

### 3.6 Trace (`DKN_TRACE_*`)

| ID | Type | Questions | DKM path | Service | Phase |
|----|------|-----------|----------|---------|-------|
| DKN_TRACE_ENGINES | EnginesTraceKnowledge | — | `engines_trace[]` | KnowledgeBuilder | A |

---

## 4. Services producteurs (14 responsabilités)

| Service | Types produits | Module cible V2 |
|---------|----------------|-----------------|
| DatasetLoader | DKN_META_* | `data/services/acquisition/dataset_loader.py` |
| SchemaProfiler | DKN_COLUMN_SCHEMA, DKN_COLUMN_NULLS | `schema_profiler.py` |
| TypeInferencer | DKN_COLUMN_TYPE, DKN_SCHEMA_ROLES | `type_inferencer.py` |
| CardinalityAnalyzer | DKN_COLUMN_CARDINALITY | `cardinality_analyzer.py` |
| NumericStatsEngine | DKN_COLUMN_STATS | `numeric_stats.py` |
| TemporalProfiler | (stats dates) | `temporal_profiler.py` |
| QualityAnalyzer | DKN_QUAL_* | `quality_analyzer.py` |
| MetricAggregator | DKN_METRIC_* | `metric_aggregator.py` |
| InsightComposer | DKN_INS_SUMMARY, DKN_INS_SUGGESTIONS | `insight_composer.py` |
| DomainClassifier | DKN_INS_DOMAIN | `domain_classifier.py` |
| SidebarGenerator | DKN_FILTER_WIDGET | `sidebar_generator.py` |
| ChartRecommender | DKN_INS_DEFAULT_CHART | `chart_recommender.py` |
| FilterEngine | (runtime, pas slice) | `filter_engine.py` |
| KnowledgeBuilder | fusion + DKN_META_JOB | `knowledge_builder.py` |

---

## 5. Matrice vivante (mise à jour par jalon)

| Type | Phase A | Phase B | Phase C |
|------|---------|---------|---------|
| DKN_COLUMN_SCHEMA | ⏳ | — | — |
| DKN_COLUMN_TYPE | ⏳ | — | — |
| DKN_FILTER_WIDGET | — | ⏳ | — |
| DKN_INS_SUMMARY | ⏳ | — | — |
| DKN_METRIC_RANKING | — | ⏳ | — |

_Remplacer ⏳ par ✅ au fil de l'implémentation._

---

_Data Knowledge Catalog v1 — ~25 types MVP (extensible domaine DPE/ventes)_
