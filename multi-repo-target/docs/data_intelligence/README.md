# TAYIER OS — Data Intelligence (documentation V2)

> **Plateforme universelle d'analyse de données** : upload Excel/CSV → compréhension (Knowledge Manifest) → sidebar filtres dynamiques → visualisation → chat NL.

**Projet :** `Python-Mastery-Nexus-Triple-Core-main`  
**État V1 (livré) :** visualisation DPE fixe — Django + `TableFactory` + ApexCharts  
**Cible V2 :** n'importe quel Excel/CSV, même méthodologie que SNORBIK Cut (Knowledge-first)

---

## Thèse produit (à lire en premier)

> **La plateforme ne visualise pas directement une donnée. Elle construit d'abord une connaissance structurée du dataset (Data Knowledge Manifest), expose ses propriétés dans une sidebar pour filtrer, puis affiche — et enfin répond en langage naturel.**

**Règle 80/20 :** 80 % automatique à l'upload (schema, stats, résumé) ; 20 % revue humaine si ambiguïté (`needs_user_review`).

---

## Méthode officielle (6 couches)

```text
Pourquoi (CDC)
  → Questions métier universelles
    → Knowledge Types (DKN_*)
      → Services producteurs
        → Technologies (pandas, DuckDB, LLM…)
          → Implémentation (Django API, MCP, chat UI)
```

**Chaîne ontologique (ADR-001) :**

```text
Question → Knowledge Type → Service → Technologie → chemin JSON dans le Manifest
```

**Référence méthodologique :** SNORBIK Cut V3 (`asset game agent/products/snorbik-cut/docs/`) — même pattern appliqué aux données tabulaires.

---

## Index des documents

| # | Document | Rôle | Priorité implémentation |
|---|----------|------|-------------------------|
| ★ | [ARCHITECTURE_UNIVERSAL_DATA_PLATFORM.md](./ARCHITECTURE_UNIVERSAL_DATA_PLATFORM.md) | Handbook — vision, couches, services, API | Lire en 2e |
| 0 | [CAHIER_DES_CHARGES_DATA_V1.md](./CAHIER_DES_CHARGES_DATA_V1.md) | Personas, périmètre V1→V2, hors scope | Lire en 3e |
| 1 | [USER_JOURNEY_UPLOAD_TO_VIZ.md](./USER_JOURNEY_UPLOAD_TO_VIZ.md) | Parcours utilisateur étape par étape | **P0** |
| 2 | [DATA_KNOWLEDGE_MANIFEST_SPEC.md](./DATA_KNOWLEDGE_MANIFEST_SPEC.md) | Schéma JSON artefact central | **P0** |
| 3 | [QUESTIONS_CATALOG_UNIVERSAL.md](./QUESTIONS_CATALOG_UNIVERSAL.md) | Questions valables pour tout CSV/Excel | **P0** |
| 4 | [DATA_KNOWLEDGE_CATALOG.md](./DATA_KNOWLEDGE_CATALOG.md) | Types `DKN_*` + lifecycle | **P0** |
| 5 | [SIDEBAR_FILTER_SPEC.md](./SIDEBAR_FILTER_SPEC.md) | Mapping type colonne → widget filtre | **P1** |
| 6 | [SCENARIOS_ACCEPTANCE_DATA.md](./SCENARIOS_ACCEPTANCE_DATA.md) | Critères d'acceptation testables | **P1** |
| 7 | [MIGRATION_NEXUS_V1_TO_V2.md](./MIGRATION_NEXUS_V1_TO_V2.md) | Pont code actuel → Manifest | **P1** |
| 8 | [QUESTIONS_CATALOG_DPE.md](./QUESTIONS_CATALOG_DPE.md) | Extension domaine rénovation/DPE | P2 |
| — | [adr/ADR-001-data-knowledge-first.md](./adr/ADR-001-data-knowledge-first.md) | Ontologie knowledge-first | ADR |
| — | [adr/ADR-002-llm-manifest-only.md](./adr/ADR-002-llm-manifest-only.md) | LLM ne voit pas les lignes brutes | ADR |
| ★ | [HISTORIQUE_DEVELOPPEMENT.md](./HISTORIQUE_DEVELOPPEMENT.md) | **Journal implémentation + handoff agent** | **Lire en 1er si reprise** |

---

## Code V1 existant (points d'ancrage)

| Composant | Chemin | Rôle V1 |
|-----------|--------|---------|
| Pipeline ETL | `data/services/data_processing/pipeline_DPE.py` | Un seul dataset DPE |
| TableFactory | `data/services/data_processing/table_factory.py` | JSON schema-data pour charts |
| Config colonnes | `data/services/data_processing/data_config/config_data_DPE.json` | Proto-catalogue colonnes |
| API dashboard | `data/views.py` → `/api/dashboard/<filename>/` | Sert JSON pré-calculés |
| Front | `static/js/controllers/mainController.js` | Filtres codés en dur |

**V2 :** ces modules restent pour **régression DPE** ; la source de vérité devient `data_knowledge_manifest`.

---

## Jalons V2 (sans dates — DoD par jalon)

| Jalon | Livrable | DoD |
|-------|----------|-----|
| **0** | Docs ontologie (ce dossier) | Spec Manifest + Questions + Journey verts |
| **A** | `analyze_dataset()` + Manifest sur upload | SC-UNIVERSAL-01 schema < 15 s |
| **B** | Sidebar dynamique depuis `schema.columns` | Filtres sans config manuelle |
| **C** | Charts génériques (type → chart) | SC-UNIVERSAL-01 viz OK |
| **D** | Chat Analyst (KM-only) | 10 questions types via chips |
| **E** | MCP + export rapport | Tools `get_knowledge`, `export_report` |

---

## Pour un assistant IA (instructions de lecture)

0. **Reprise de session ?** Lire **[HISTORIQUE_DEVELOPPEMENT.md](./HISTORIQUE_DEVELOPPEMENT.md)** en premier (état code, tests, limites, git).
1. Lire **USER_JOURNEY** puis **DATA_KNOWLEDGE_MANIFEST_SPEC** — flux et artefact.
2. Lire **QUESTIONS_CATALOG_UNIVERSAL** + **DATA_KNOWLEDGE_CATALOG** — quoi implémenter.
3. Lire **SIDEBAR_FILTER_SPEC** — contrat UI sidebar.
4. Lire **MIGRATION_NEXUS_V1_TO_V2** — ne pas casser `/api/dashboard/*`.
5. Valider avec **SCENARIOS_ACCEPTANCE_DATA** avant merge.

**Interdit V2 :** envoyer le CSV/Excel entier au LLM. **Autorisé :** `data_knowledge_manifest` + sous-ensemble `dkm_planner_subset`.

---

_Documentation Data Intelligence V1 — Juillet 2026 — Tayier OS / Renovate Energy_
