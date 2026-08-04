# ADR-001 — Data Knowledge Types as first-class citizens

**Statut :** Accepté  
**Date :** 2026-07-12  
**Projet :** TAYIER OS Data Intelligence V2

## Contexte

L'architecture V1 organise le code autour du **pipeline DPE** et de **TableFactory** (JSON charts). L'audit V2 identifie que la **connaissance du dataset** doit être l'ontologie centrale — les services (SchemaProfiler, etc.) n'en sont que les producteurs.

## Décision

1. Introduire un **Data Knowledge Catalog** (`DATA_KNOWLEDGE_CATALOG.md`) avec types nommés `DKN_*`.
2. Chaîne de conception officielle :

   ```text
   Question → Knowledge Type (DKN_*) → Service → Technologie
   ```

3. Chaque type possède : `knowledge_id`, `dkm_paths`, `producer_service`, `depends_on`, lifecycle.
4. `KnowledgeBuilder` fusionne des `DataKnowledgeSlice` typées.
5. Chat, sidebar et charts **consomment** le DKM — ils ne recalculent pas ad hoc.

## Conséquences

### Positives
- Plateforme universelle (CSV/Excel quelconque)
- Extension domaine (DPE, Wealtho ventes) par catalogue questions
- Tests par type de savoir

### Négatives
- Documentation à maintenir
- Refactoring `data/services/` en modules acquisition

## Références

- [DATA_KNOWLEDGE_CATALOG.md](../DATA_KNOWLEDGE_CATALOG.md)
- SNORBIK ADR-003 (`snorbik-cut/docs/adr/ADR-003-knowledge-first-ontology.md`)
