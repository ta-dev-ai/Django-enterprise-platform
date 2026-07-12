# ADR-002 — LLM and Chat consume Manifest only (no raw rows)

**Statut :** Accepté  
**Date :** 2026-07-12  
**Projet :** TAYIER OS Data Intelligence V2

## Contexte

Un dataset peut contenir 10 000 à 800 000 lignes. Envoyer le CSV/Excel au LLM est lent, coûteux, et provoque hallucinations. V1 n'a pas de chat ; V2 l'introduit.

## Décision

1. **ChatAnalyst** et tout agent LLM reçoivent uniquement :
   - `dkm_planner_subset(manifest)` — schema résumé, metrics, insights, quality
   - message utilisateur NL
   - historique conversation court

2. **Interdit** dans le contexte LLM :
   - `raw_rows`, DataFrame sérialisé, échantillon > 50 lignes non agrégées
   - chemins fichiers absolus, credentials

3. Calculs demandés en NL non présents dans DKM → **lazy MetricAggregator** déterministe, puis injection résultat dans réponse (pas re-prompt avec lignes).

4. Fonction `audit_llm_context(context) -> violations` en tests (pattern SNORBIK `km_context.py`).

## Conséquences

### Positives
- Coût token maîtrisé
- Réponses sourcées (`citations[]` → `metrics.items.id`)
- Privacy renforcée

### Négatives
- Métriques non prévues au catalogue → latence lazy calc
- Maintenance `dkm_planner_subset` à jour

## Références

- [DATA_KNOWLEDGE_MANIFEST_SPEC.md](../DATA_KNOWLEDGE_MANIFEST_SPEC.md) §6
- SNORBIK ADR-001 (`snorbik-cut/docs/adr/ADR-001-llm-km-only.md`)
