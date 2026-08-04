# Catalogue des questions métier — Universel (tout CSV/Excel)

_Version 1.0 — Juillet 2026_  
**Méthode :** Besoin → **Knowledge Type (`DKN_*`)** → Service → Technologie  
**Artefact :** chaque réponse alimente le [Data Knowledge Manifest](./DATA_KNOWLEDGE_MANIFEST_SPEC.md).

> Ces questions s'appliquent à **n'importe quel** fichier tabulaire uploadé.  
> Extension domaine DPE : [QUESTIONS_CATALOG_DPE.md](./QUESTIONS_CATALOG_DPE.md).

---

## Légende

| Colonne | Description |
|---------|-------------|
| **Service** | Producteur V2 ([ARCHITECTURE_UNIVERSAL_DATA_PLATFORM.md](./ARCHITECTURE_UNIVERSAL_DATA_PLATFORM.md)) |
| **DKM** | Chemin JSON dans le Manifest |
| **Phase** | `A` upload+schema · `B` sidebar+viz · `C` chat · `D` MCP |

---

## 1. Métadonnées fichier

| ID | Question métier | Service | DKM | Phase |
|----|-----------------|---------|-----|-------|
| Q_META_01 | Quel est le nom et format du fichier ? | DatasetLoader | `meta.filename`, `meta.format` | A |
| Q_META_02 | Combien de lignes ? | DatasetLoader | `meta.row_count` | A |
| Q_META_03 | Combien de colonnes ? | DatasetLoader | `meta.column_count` | A |
| Q_META_04 | Quelle est l'empreinte mémoire ? | DatasetLoader | `meta.memory_bytes` | A |
| Q_META_05 | Quel est le hash du fichier ? | DatasetLoader | `meta.sha256` | A |
| Q_META_06 | Quand a-t-il été analysé ? | KnowledgeBuilder | `meta.analyzed_at` | A |

---

## 2. Schéma et colonnes

| ID | Question métier | Service | DKM | Phase |
|----|-----------------|---------|-----|-------|
| Q_SCHEMA_01 | Quels sont les noms de colonnes ? | SchemaProfiler | `schema.columns[].name` | A |
| Q_SCHEMA_02 | Quel type inféré par colonne ? | TypeInferencer | `schema.columns[].inferred_type` | A |
| Q_SCHEMA_03 | Quel taux de valeurs manquantes ? | SchemaProfiler | `schema.columns[].null_rate` | A |
| Q_SCHEMA_04 | Quelle cardinalité (low/medium/high) ? | CardinalityAnalyzer | `schema.columns[].cardinality` | A |
| Q_SCHEMA_05 | Quelles valeurs dominantes (top N) ? | CardinalityAnalyzer | `schema.columns[].top_values` | A |
| Q_SCHEMA_06 | Y a-t-il une colonne identifiant unique ? | SchemaProfiler | `schema.primary_key_candidate` | A |
| Q_SCHEMA_07 | Y a-t-il une colonne temps ? | TypeInferencer | `schema.time_column_candidate` | A |
| Q_SCHEMA_08 | Quelles colonnes sont des mesures (montants) ? | TypeInferencer | `schema.measure_columns` | A |
| Q_SCHEMA_09 | Quelles colonnes sont des dimensions ? | TypeInferencer | `schema.dimension_columns` | A |
| Q_SCHEMA_10 | Quel widget filtre pour chaque colonne ? | SidebarGenerator | `schema.columns[].filter_widget` | B |

---

## 3. Statistiques numériques

| ID | Question métier | Service | DKM | Phase |
|----|-----------------|---------|-----|-------|
| Q_STAT_01 | Min / max / moyenne par colonne numérique ? | NumericStatsEngine | `schema.columns[].stats` | A |
| Q_STAT_02 | Médiane et percentiles ? | NumericStatsEngine | `schema.columns[].stats.median`, `p95` | A |
| Q_STAT_03 | Somme des mesures clés ? | MetricAggregator | `metrics.items[]` | A |
| Q_STAT_04 | Distribution par bucket ? | MetricAggregator | `metrics.distributions[]` | B |

---

## 4. Temporel

| ID | Question métier | Service | DKM | Phase |
|----|-----------------|---------|-----|-------|
| Q_TIME_01 | Quelle plage de dates ? | TemporalProfiler | `schema.columns[].stats.min/max` | A |
| Q_TIME_02 | Quel grain (jour, mois, année) ? | TemporalProfiler | `metrics.by_time[].grain` | B |
| Q_TIME_03 | Agrégat par période ? | MetricAggregator | `metrics.by_time[]` | B |

---

## 5. Qualité données

| ID | Question métier | Service | DKM | Phase |
|----|-----------------|---------|-----|-------|
| Q_QUAL_01 | Le dataset est-il exploitable ? | QualityAnalyzer | `quality.validation.ok` | A |
| Q_QUAL_02 | Y a-t-il des lignes dupliquées ? | QualityAnalyzer | `quality.duplicate_row_count` | A |
| Q_QUAL_03 | Faut-il demander une revue utilisateur ? | QualityAnalyzer | `quality.needs_user_review` | A |
| Q_QUAL_04 | Quelle confiance globale ? | QualityAnalyzer | `quality.confidence` | A |
| Q_QUAL_05 | Quelles colonnes sont ambiguës ? | TypeInferencer | `quality.ambiguous_columns[]` | A |
| Q_QUAL_06 | Score de complétude ? | QualityAnalyzer | `quality.breakdown.completeness_score` | A |

---

## 6. Synthèse et insights

| ID | Question métier | Service | DKM | Phase |
|----|-----------------|---------|-----|-------|
| Q_INS_01 | Résumé lisible en français ? | InsightComposer | `insights.summary_fr` | A |
| Q_INS_02 | Quel domaine métier détecté ? | DomainClassifier | `insights.detected_domain` | A |
| Q_INS_03 | Quelles questions suggérer à l'utilisateur ? | InsightComposer | `insights.suggested_questions[]` | C |
| Q_INS_04 | Quel graphique par défaut ? | ChartRecommender | `views.default_chart` | B |

---

## 7. Filtrage et visualisation

| ID | Question métier | Service | DKM | Phase |
|----|-----------------|---------|-----|-------|
| Q_VIZ_01 | Quelles colonnes sont filtrables sidebar ? | SidebarGenerator | colonnes avec `filter_widget` | B |
| Q_VIZ_02 | Combien de lignes après filtres ? | FilterEngine | réponse API `filtered_row_count` | B |
| Q_VIZ_03 | Données pour chart X/Y ? | ChartEngine | réponse API `chart.data` | B |
| Q_VIZ_04 | Aperçu tableau paginé ? | PreviewTableEngine | réponse API `preview.rows` | B |

---

## 8. Langage naturel (chat)

| ID | Question métier | Service | DKM | Phase |
|----|-----------------|---------|-----|-------|
| Q_NL_01 | L'utilisateur pose une question libre — quelles métriques utiliser ? | ChatAnalyst | lit `metrics` + `schema` | C |
| Q_NL_02 | Faut-il recalculer ou lire pré-calculé ? | DecisionEngine | lazy vs cache | C |
| Q_NL_03 | La réponse est-elle sourcée ? | ChatAnalyst | `citations[]` → `metrics.items.id` | C |
| Q_NL_04 | Faut-il proposer une action (export, chart) ? | DialogueGate | chips suggested | C |

---

## 9. Questions utilisateur typiques (NL → mapping)

| Question utilisateur (exemple) | Types DKM requis | Action |
|--------------------------------|------------------|--------|
| « Combien de lignes ? » | `meta.row_count` | Texte direct |
| « CA total ? » | `metrics.items[revenue_total]` | Texte + citation |
| « CA par mois » | `metrics.by_time` ou lazy agg | Chart line |
| « Top 10 produits » | `metrics.rankings` ou lazy | Chart bar |
| « Colonnes avec beaucoup de vides » | `schema.columns[].null_rate` | Liste |
| « Filtre arrondissement 75011 » | sidebar + FilterEngine | Filtre + refresh |
| « Quel produit investir ? » | insights + rankings + LLM | Recommandation |

---

## 10. Priorisation implémentation

| Phase | Questions minimum | Count |
|-------|-------------------|-------|
| **A** (MVP analyze) | Q_META_* + Q_SCHEMA_01–05 + Q_QUAL_01–04 + Q_INS_01 | ~20 |
| **B** (sidebar+viz) | + Q_SCHEMA_10, Q_VIZ_*, Q_STAT_03, Q_TIME_* | +15 |
| **C** (chat) | + Q_NL_*, Q_INS_03 | +8 |

---

_50 questions universelles — extensible par domaine (DPE, ventes Wealtho, etc.)_
