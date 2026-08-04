# Historique de développement — Data Intelligence V2 (Nexus)

_Version handoff — Juillet 2026_  
**Projet :** `Python-Mastery-Nexus-Triple-Core-main`  
**Objectif du document :** permettre à un **autre agent / développeur** de reprendre le travail sans relire toute la conversation.

> **Ne pas modifier** le fichier plan Cursor :  
> `c:\Users\ntpar\.cursor\plans\nexus_data_intelligence_jalons_d5686077.plan.md`

---

## 1. Résumé exécutif

| Élément | Statut |
|---------|--------|
| **Jalon 0** — Documentation ontologie (`docs/data_intelligence/`, 14 fichiers) | ✅ Livré (session précédente) |
| **Jalon A** — Acquisition + DKM sur DPE builtin | ✅ Livré |
| **Jalon B** — Upload CSV/XLSX universel | ✅ Livré |
| **Jalon C** — Sidebar + FilterEngine | ✅ Livré |
| **Jalon D** — Charts génériques + UI explorer | ✅ Livré |
| **Jalon E** — Chat KM-only (ADR-002) | ✅ Livré (fallback déterministe, pas de LLM externe branché) |
| **Jalon F** — MCP tools + script validation | ✅ Livré |
| **Jalon REG** — Régression V1 + pytest + README | ✅ Livré |
| **Tests** `tests/data_intelligence/` | ✅ **19/19 verts** (dernière exécution : juillet 2026) |
| **API V1** `/api/dashboard/*` | ✅ Préservée, non modifiée dans `data/views.py` |

**Thèse respectée :** le Data Knowledge Manifest (DKM) est la source de vérité V2 ; le dashboard V1 coexiste en legacy.

---

## 2. Chronologie des sessions

### Session 1 — Spécification (Jalon 0)

- Rédaction de l'ontologie complète dans `docs/data_intelligence/` :
  - Manifest spec, user journey, sidebar, architecture, scénarios d'acceptation, ADR-001/002, migration V1→V2.
- Lien ajouté dans le `README.md` racine.
- **Aucun code Python V2** à ce stade.

### Session 2 — Implémentation jalons A → REG

- Implémentation linéaire du plan jalons (ordre strict A → B → C → D → E → F → REG).
- Création de tous les modules listés en section 4.
- Correction de bugs d'inférence de types (`date_vente`, `montant`) et de filtre `between` sur dates.
- Validation finale : `pytest` 19/19 + `scripts/validate_data_platform.py` OK.

### Session 3 — Handoff (ce document)

- Rédaction de cet historique pour la passation agent.

---

## 3. Décisions d'architecture prises en implémentation

| Décision | Choix retenu | Raison |
|----------|--------------|--------|
| Stockage datasets uploadés | Fichiers `data/datasets/{uuid}/` (pas de migration DB) | Plan V2.0 : pas de DB lourde |
| Dataset DPE builtin | IDs `builtin-dpe` et alias `dpe_paris` | Plan + SC-REGRESSION-DPE |
| Source DPE sans CSV 800k | Fixture `dpe_builtin_sample.csv` (500 lignes) + cache JSON | Les JSON `export_dashboard/table_*.json` font 55–77 Mo ; trop lourds pour analyse à la volée |
| Vues API V2 | Fichier séparé `data/views_datasets.py` | Ne pas toucher `data/views.py` (régression V1) |
| Chat | Fallback **déterministe** uniquement | ADR-002 respecté ; OpenRouter/Ollama documenté mais non branché |
| CSRF | `@csrf_exempt` sur POST upload/analyze/filter/chart/chat | API interne / tests ; à durcir en prod |
| Cache DKM builtin | `export_dashboard/knowledge_manifest.json` | Hook optionnel dans `pipeline_DPE.py` |

---

## 4. Cartographie du code livré

### 4.1 Acquisition (Jalon A)

```text
data/services/acquisition/
  __init__.py
  dataset_loader.py       # read CSV/XLSX, meta (row_count, sha256…)
  schema_profiler.py      # colonnes, nulls, distinct_count
  type_inferencer.py      # inferred_type, cardinality, filter_widget, semantic_role
  quality_analyzer.py     # confidence, needs_user_review, ambiguous_columns
  metric_aggregator.py    # metrics.items, rankings
  insight_composer.py     # summary_fr, suggested_questions, detected_domain
  knowledge_builder.py    # fusion slices → DKM complet
  dkm_context.py          # dkm_planner_subset + audit_llm_context (ADR-002)
  analyze_service.py      # orchestrateur get_or_build_manifest / analyze_dataframe
  fixtures/
    dpe_builtin_sample.csv   # 500 lignes synthétiques DPE
```

### 4.2 Runtime (Jalons C, D)

```text
data/services/runtime/
  sidebar_generator.py    # DKM → spec filtres UI
  filter_engine.py        # opérateurs in/between/contains/eq/is_null…
  chart_engine.py         # bar/line/table depuis default_chart ou chart_spec
```

### 4.3 Intelligence (Jalon E)

```text
data/services/intelligence/
  chat_analyst.py         # ask_data() déterministe + build_llm_context()
  dialogue_gate.py        # chips, needs_user_review, confirm_type
```

### 4.4 Stockage & API

```text
data/dataset_store.py     # CRUD fichiers datasets/, alias builtin
data/views_datasets.py    # 7 endpoints REST V2
data/urls.py              # routes /api/datasets/*
data/mcp/
  tools.py                # analyze_dataset, get_knowledge, ask_data, export_report
  cli.py                  # CLI argparse
```

### 4.5 UI (Jalons B, C, D, E)

```text
templates/pages/dashboard/
  dataset_upload.html     # upload + bandeau summary_fr / confidence
  dataset_explorer.html   # layout sidebar + chart + chat

static/js/dataset/
  SidebarController.js
  ChartController.js      # ApexCharts (CDN)
  ChatPanel.js

batimentRenovation/urls.py   # /dashboard/dataset/upload/, /dashboard/dataset/<id>/
batimentRenovation/views.py  # dashboard_dataset_upload, dashboard_dataset_explorer
```

### 4.6 Tests & validation (Jalon REG)

```text
tests/conftest.py
tests/data_intelligence/
  test_dkm_dpe.py              # Jalon A + API knowledge
  test_upload_analyze.py       # Jalon B, SC-UNIVERSAL-01 (schema)
  test_sidebar.py              # SB-01 à SB-05
  test_chart.py                # Jalon D
  test_chat_manifest_only.py   # ADR-002 audit
  test_regression_dpe.py       # /api/dashboard/* intact

pytest.ini
scripts/validate_data_platform.py
```

### 4.7 Fichiers modifiés (legacy préservé)

| Fichier | Modification |
|---------|--------------|
| `data/views.py` | **Aucune** — API dashboard V1 intacte |
| `data/urls.py` | Ajout routes `/api/datasets/*` |
| `data/services/data_processing/pipeline_DPE.py` | Hook post-ETL → cache `knowledge_manifest.json` |
| `requirements.txt` | + pandas, numpy, openpyxl, pytest, pytest-django |
| `README.md` | Section Data Intelligence V2 + commandes validation |

---

## 5. API V2 — contrat implémenté

| Méthode | Route | Handler |
|---------|-------|---------|
| POST | `/api/datasets/upload` | `api_dataset_upload` |
| POST | `/api/datasets/{id}/analyze` | `api_dataset_analyze` |
| GET | `/api/datasets/{id}/knowledge` | `api_dataset_knowledge` |
| GET | `/api/datasets/{id}/sidebar` | `api_dataset_sidebar` |
| POST | `/api/datasets/{id}/filter` | `api_dataset_filter` |
| POST | `/api/datasets/{id}/chart` | `api_dataset_chart` |
| POST | `/api/datasets/{id}/chat` | `api_dataset_chat` |

**Legacy inchangé :** `GET /api/dashboard/<filename>/` → `data/views.py::api_dashboard_data`

### Pages UI

| URL | Template |
|-----|----------|
| `/dashboard/dataset/upload/` | `dataset_upload.html` |
| `/dashboard/dataset/{dataset_id}/` | `dataset_explorer.html` |

---

## 6. Schéma DKM — conformité

Le JSON produit suit `docs/data_intelligence/DATA_KNOWLEDGE_MANIFEST_SPEC.md` :

- `dkm_version`, `meta`, `schema.columns[]`, `metrics`, `quality`, `insights`, `views.default_chart`, `engines_trace`

**Sous-ensemble LLM :** `dkm_planner_subset()` dans `dkm_context.py` — utilisé par le chat et audité en test.

---

## 7. Scénarios d'acceptation — état

| Scénario | Statut | Où c'est testé |
|----------|--------|----------------|
| SC-UNIVERSAL-01 (schema, upload 10k) | ✅ | `test_upload_analyze.py` |
| SC-UNIVERSAL-01 (sidebar, filter, chart) | ✅ | `test_sidebar.py`, `test_chart.py`, `validate_data_platform.py` |
| SC-REGRESSION-DPE | ✅ | `test_regression_dpe.py`, `test_dkm_dpe.py` |
| SC-CHAT-01 (ADR-002) | ✅ | `test_chat_manifest_only.py` |
| SB-01 à SB-05 | ✅ | `test_sidebar.py` |
| SC-UNIVERSAL-02 (fichier ambigu + modal UI) | ⚠️ Partiel | Backend `dialogue_gate.py` OK ; **modal UI non implémentée** |
| SC-UNIVERSAL-03 (Excel multi-feuilles) | ❌ Hors scope | Documenté hors scope V2.0 |
| SC-PERF-01 (100k/500k) | ❌ Non testé | Seuil 10k validé |

---

## 8. Bugs corrigés pendant l'implémentation

| Problème | Cause | Correctif |
|----------|-------|-----------|
| `montant` inféré en `datetime` | Fallback `_is_datetime` parsait des floats comme dates | Datetime uniquement si nom colonne contient hint temporel (`date`, `time`…) |
| Filtre `between` dates inefficace | `dayfirst=True` + comparaisons NaT | `dayfirst=False` + `mask.fillna(False)` + fallback comparaison string |
| Upload test Django échouait | `BytesIO` sans attribut `name` | `file_obj.name = "ventes_sample.csv"` dans le test |

---

## 9. Limitations connues (pour le prochain agent)

1. **DPE réel 800k lignes** : le builtin utilise une fixture 500 lignes ou le cache JSON ; pas le CSV source complet (non versionné / absent du repo).
2. **Chat sans LLM externe** : réponses par règles (`chat_analyst.py`). Brancher OpenRouter/Ollama = travail futur (spec dans `AGENTS_AND_CHAT_DATA.md`).
3. **Excel multi-feuilles** : `load_dataframe` lit la feuille 0 uniquement.
4. **CSRF exempt** sur endpoints POST — à sécuriser si exposition publique.
5. **UI explorer minimale** : pas de pagination tableau avancée, pas de modal `needs_user_review`, pas d'intégration dans la sidebar dashboard V1 existante (`mainController.js` reste legacy).
6. **MCP** : module Python + CLI, pas de serveur MCP stdio dédié type SNORBIK.
7. **Warnings pandas** : `UserWarning` sur parsing dates DPE (`date_etablissement_dpe`) — cosmétique, tests passent.
8. **Git** : grande partie du code V2 est **non commitée** (`??` dans `git status`) — voir section 11.

---

## 10. Commandes de reprise (obligatoires avant toute modification)

```bash
cd Python-Mastery-Nexus-Triple-Core-main

# Dépendances
python -m pip install -r requirements.txt

# Tests Data Intelligence (DoD)
python -m pytest tests/data_intelligence/ -v

# Parcours E2E script
python scripts/validate_data_platform.py

# Serveur local (pages UI)
python manage.py runserver
# → http://127.0.0.1:8000/dashboard/dataset/upload/
# → http://127.0.0.1:8000/api/datasets/builtin-dpe/knowledge
```

### MCP CLI (exemples)

```bash
python -m data.mcp.cli analyze_dataset path/to/file.csv
python -m data.mcp.cli get_knowledge builtin-dpe
python -m data.mcp.cli ask_data builtin-dpe "Combien de lignes ?"
python -m data.mcp.cli export_report builtin-dpe --format html
```

---

## 11. État Git au moment du handoff

Fichiers V2 principaux **non suivis** (`??`) :

- `data/services/acquisition/`, `runtime/`, `intelligence/`
- `data/dataset_store.py`, `data/views_datasets.py`, `data/mcp/`
- `docs/data_intelligence/` (toute la doc ontologie)
- `tests/`, `pytest.ini`, `scripts/validate_data_platform.py`
- `static/js/dataset/`, templates upload/explorer
- `data/services/acquisition/fixtures/dpe_builtin_sample.csv`
- `data/services/data_processing/export_dashboard/knowledge_manifest.json` (généré)

Fichiers **modifiés** (`M`) pertinents V2 :

- `data/urls.py`, `requirements.txt`, `README.md`
- `batimentRenovation/urls.py`, `batimentRenovation/views.py`
- `data/services/data_processing/pipeline_DPE.py`

**Action recommandée pour le prochain agent :** proposer un commit groupé « Data Intelligence V2 jalons A–REG » en **excluant** `node_modules/`, `db.sqlite3`, `__pycache__/`.

---

## 12. Pistes de travail suivantes (hors plan actuel — tous jalons faits)

| Priorité | Tâche | Référence |
|----------|-------|-----------|
| P1 | Commit + PR du code V2 | Section 11 |
| P1 | Brancher LLM (OpenRouter/Ollama) sur `chat_analyst.py` | `AGENTS_AND_CHAT_DATA.md` §4 |
| P2 | Modal UI `needs_user_review` (SC-UNIVERSAL-02) | `dialogue_gate.py` déjà prêt |
| P2 | Remplacer fixture DPE par vrai CSV si disponible localement | `data_source_inputs/dpe03existant_paris.csv` |
| P2 | Migrer `mainController.js` → SidebarController générique | `SIDEBAR_FILTER_SPEC.md` §9 |
| P3 | Serveur MCP stdio (pattern SNORBIK) | `data/mcp/tools.py` |
| P3 | Perf 100k+ lignes (DuckDB ?) | `SC-PERF-01` |
| P3 | React V2 : connecter `ui2/react-app` aux endpoints `/api/datasets/*` | `README.md` migration React |

---

## 13. Ordre de lecture pour le prochain agent

1. **Ce fichier** (`HISTORIQUE_DEVELOPPEMENT.md`)
2. Plan jalons (lecture seule) : `.cursor/plans/nexus_data_intelligence_jalons_d5686077.plan.md`
3. `docs/data_intelligence/README.md` — index ontologie
4. `docs/data_intelligence/DATA_KNOWLEDGE_MANIFEST_SPEC.md`
5. `docs/data_intelligence/SCENARIOS_ACCEPTANCE_DATA.md`
6. `data/services/acquisition/analyze_service.py` — point d'entrée analyse
7. `data/views_datasets.py` — surface API

**Règle absolue :** ne pas casser `GET /api/dashboard/*` — valider avec `test_regression_dpe.py` après chaque changement touchant `data/`.

---

## 14. Journal des validations (dernière session)

| Commande | Résultat | Date |
|----------|----------|------|
| `python -m pytest tests/data_intelligence/ -v` | **19 passed**, 2 warnings pandas | 2026-07-12 |
| `python scripts/validate_data_platform.py` | All validation steps passed | 2026-07-12 |

---

_Historique rédigé pour passation agent — Tayier OS Data Intelligence V2 — Nexus Triple Core_
