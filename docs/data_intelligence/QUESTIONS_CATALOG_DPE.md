# Catalogue des questions métier — Domaine DPE / Rénovation

_Version 1.0 — Juillet 2026_  
**Extension** du [QUESTIONS_CATALOG_UNIVERSAL.md](./QUESTIONS_CATALOG_UNIVERSAL.md) pour le dataset Paris rénovation (+800k DPE).

> Questions **universelles** (schema, qualité) + questions **domaine** ci-dessous.

---

## Domain pack `renovation_dpe`

| Attribut | Valeur |
|----------|--------|
| `domain_hint` | `renovation_dpe` |
| `config_legacy` | `data_config/config_data_DPE.json` |
| `pipeline` | `pipeline_DPE.py` |
| `builtin_dataset_id` | `builtin-dpe-paris` |

---

## 1. Énergie / DPE

| ID | Question métier | Service | DKM path |
|----|-----------------|---------|----------|
| Q_DPE_01 | Distribution étiquettes A→G ? | MetricAggregator | `metrics.dpe_class_distribution` |
| Q_DPE_02 | Combien de logements classe F/G ? | MetricAggregator | `metrics.items[f_g_count]` |
| Q_DPE_03 | Consommation moyenne kWh/m² ? | MetricAggregator | `metrics.items[avg_conso_m2]` |
| Q_DPE_04 | Coût énergie annuel moyen ? | MetricAggregator | `metrics.items[avg_cost_energy]` |

---

## 2. Géographie

| ID | Question métier | Service | DKM path |
|----|-----------------|---------|----------|
| Q_GEO_01 | Répartition par arrondissement ? | MetricAggregator | `metrics.rankings.by_postal_code` |
| Q_GEO_02 | Top arrondissements classe F ? | MetricAggregator | `metrics.rankings.f_by_postal` |

---

## 3. Bâtiment / technique

| ID | Question métier | Service | DKM path |
|----|-----------------|---------|----------|
| Q_BAT_01 | Types bâtiment (appartement/maison) ? | MetricAggregator | `metrics.building_type_distribution` |
| Q_BAT_02 | Qualité isolation murs dominante ? | MetricAggregator | `metrics.isolation_quality` |
| Q_BAT_03 | Année construction moyenne ? | NumericStatsEngine | `schema.columns[annee_construction].stats` |

---

## 4. Financier / marché

| ID | Question métier | Service | DKM path |
|----|-----------------|---------|----------|
| Q_FIN_01 | Surface habitable moyenne ? | NumericStatsEngine | `schema.columns[surface_habitable_logement].stats` |
| Q_FIN_02 | Valorisation liée DPE (marché) ? | DomainInsight | `insights.market_summary_fr` |
| Q_FIN_03 | Où cibler rénovation privée ? | InsightComposer | `insights.recommendations[]` |

---

## 5. Sidebar DPE (mapping V1)

| Colonne | Question | Widget |
|---------|----------|--------|
| `etiquette_dpe` | Filtrer classe énergie ? | chips A–G |
| `code_postal_ban` | Filtrer arrondissement ? | search_select |
| `type_batiment` | Filtrer type ? | multi_select |
| `cout_total_5_usages` | Filtrer coût ? | numeric_range |
| `annee_construction` | Filtrer période construction ? | numeric_range |

---

## 6. Questions NL typiques (chat)

| Question utilisateur | Métriques DKM |
|---------------------|---------------|
| « Combien de DPE classe F à Paris ? » | `dpe_class_distribution` |
| « Où rénover en priorité ? » | `rankings.f_by_postal` + insights |
| « Coût moyen énergie classe D » | lazy filter + avg |
| « Isolation insuffisante par arrondissement » | groupby qualité + postal |

---

## 7. Régression V1

| Page dashboard | JSON legacy | Tables DKM |
|----------------|-------------|------------|
| batiment.html | `table_financial` | financial + metrics |
| types.html | `table_technical` | technical |
| dpe.html | `table_market` | market + dpe metrics |

SC-REGRESSION-DPE : [SCENARIOS_ACCEPTANCE_DATA.md](./SCENARIOS_ACCEPTANCE_DATA.md).

---

_Extension DPE — à fusionner dans DATA_KNOWLEDGE_CATALOG au fil des jalons_
