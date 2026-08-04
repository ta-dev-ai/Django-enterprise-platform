# Migration Nexus V1 → Data Intelligence V2

_Version 1.0 — Juillet 2026_  
Pont entre code actuel et plateforme universelle **sans rupture**.

---

## 1. Principe dual-write (inspiré SNORBIK ADR-002)

| Artefact V1 | Artefact V2 | Stratégie |
|-------------|-------------|-----------|
| 6 JSON `export_dashboard/` | `data_knowledge_manifest` | **DKM = source de vérité** ; JSON = vues legacy |
| `config_data_DPE.json` | `schema.columns` inféré | Config DPE → **seed** domaine, pas universel |
| `api_dashboard_data` | `/api/datasets/{id}/knowledge` | Les deux coexistent |
| `mainController.filters` | Sidebar dynamique | Mapping DPE documenté |

**Règle :** ne supprimer aucune route V1 tant que SC-REGRESSION-DPE n'est pas vert.

---

## 2. Cartographie modules

```text
V1 pipeline_DPE.py
  └─► V2: analyze_dataset(path, domain_hint="renovation_dpe")
        ├─► acquisition/* (nouveau)
        └─► export_legacy_views() → 6 JSON (optionnel, régression)

V1 TableFactory
  └─► V2: LegacyViewExporter(TableFactory)
        ├─► lit DataFrame + config colonnes
        └─► produit schema-data JSON (charts V1)
        └─► NE produit PAS le DKM seul

V1 config_data_DPE.json
  └─► V2: DomainPack "dpe" 
        ├─► column_labels français
        ├─► semantic_roles overrides
        └─► legacy_table_columns map

V1 data/views.py api_dashboard_data
  └─► inchangé

V1 static/js/controllers/*
  └─► V2: DataViewController générique
        └─► wrappers DPE optionnels phase transition
```

---

## 3. Étapes migration (ordre)

### Phase 0 — Documentation ✅
- `docs/data_intelligence/` complet

### Phase 1 — DKM sur DPE existant (sans upload)
1. Créer `data/services/acquisition/knowledge_builder.py`
2. Après `pipeline_DPE`, générer DKM depuis DataFrame en mémoire
3. GET `/api/datasets/builtin-dpe/knowledge`
4. Tests SC-REGRESSION-DPE

### Phase 2 — Upload générique
1. POST `/api/datasets/upload`
2. `analyze_dataset` générique CSV/XLSX
3. SC-UNIVERSAL-01

### Phase 3 — Sidebar + FilterEngine
1. `sidebar_generator.py` + `filter_engine.py`
2. Page UI `dataset_explorer.html` (nouvelle)
3. SC-SIDEBAR SB-01–05

### Phase 4 — Chart engine générique
1. `chart_engine.py`
2. ApexCharts config depuis `views.default_chart`

### Phase 5 — Chat + MCP
1. `chat_analyst.py`
2. MCP tools

### Phase 6 — Dépréciation progressive
1. Marquer `config_ia` commentaire `legacy`
2. Dashboard DPE route vers dataset_explorer avec `domain_pack=dpe`

---

## 4. Générer DKM depuis TableFactory (transition)

Pseudo-code pont :

```python
def dkm_from_dataframe(df: pd.DataFrame, *, meta: dict) -> dict:
    slices = []
    slices += SchemaProfiler().profile(df)
    slices += TypeInferencer().infer(df)
    slices += QualityAnalyzer().analyze(df)
    slices += MetricAggregator().summarize(df)
    slices += InsightComposer().compose(slices)
    return KnowledgeBuilder.merge(slices, meta=meta)
```

Les 6 JSON V1 = `LegacyViewExporter.export(df, config_data_DPE)` — **dérivé**, pas inverse.

---

## 5. Mapping colonnes DPE → sidebar V2

| Colonne | inferred_type | filter_widget | Page V1 |
|---------|---------------|---------------|---------|
| `etiquette_dpe` | category | chips | dpe |
| `code_postal_ban` | geo | search_select | market |
| `cout_total_5_usages` | currency | numeric_range | financial |
| `type_batiment` | category | multi_select | technical |
| `annee_construction` | integer | numeric_range | technical |

---

## 6. Risques

| Risque | Mitigation |
|--------|------------|
| Casser dashboard V1 | dual-write, tests SC-REGRESSION-DPE |
| Perf 800k lignes | sample analyze + métriques pré-agrégées pipeline |
| Types mal inférés | `needs_user_review` + modal |
| Token LLM trop gros | `dkm_planner_subset` |

---

## 7. Checklist assistant IA avant code

- [ ] Lire USER_JOURNEY + DATA_KNOWLEDGE_MANIFEST_SPEC
- [ ] Implémenter acquisition avant UI chat
- [ ] Préserver `/api/dashboard/*`
- [ ] Tests SC-UNIVERSAL-01 + SC-REGRESSION-DPE
- [ ] Ne pas passer DataFrame au LLM

---

_Migration V1→V2 — pont TableFactory / pipeline DPE_
