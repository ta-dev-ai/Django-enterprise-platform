# Agents, Chat et MCP — Data Intelligence

_Version 1.0 — Juillet 2026_  
**Jalon D–E** — spec cible ; implémentation après Manifest + Sidebar + Charts.

---

## 1. Agents

| Agent | Rôle | Entrée | Sortie |
|-------|------|--------|--------|
| **InsightAnalyst** | Répondre questions NL sur le dataset | DKM subset + message | texte + citations + chart_spec? |
| **ReportComposer** | Générer rapport structuré | DKM + filtres actifs | HTML/PDF markdown |
| **DialogueGate** | Gérer ambiguïtés et validation | quality + pending | questions/chips |

**Pas d'agent « qui lit le CSV »** — ADR-002.

---

## 2. Chat UI

| Élément | Description |
|---------|-------------|
| Drawer / panneau | À droite du dashboard dataset |
| Chips suggérées | `insights.suggested_questions` |
| Citations | Liens vers `metrics.items[].id` |
| Preview chart | Si réponse inclut `chart_spec` |
| Historique | Max 10 tours |

---

## 3. MCP Tools (cible)

| Tool | Paramètres | Retour |
|------|------------|--------|
| `analyze_dataset` | `path`, `domain_hint?` | DKM |
| `get_knowledge` | `dataset_id` | manifest + slices |
| `query_metric` | `dataset_id`, `metric_id` | valeur + metadata |
| `apply_filter` | `dataset_id`, `filters` | preview stats |
| `preview_chart` | `dataset_id`, `chart_spec` | chart data |
| `ask_data` | `dataset_id`, `question` | réponse NL |
| `export_report` | `dataset_id`, `format` | path fichier |

---

## 4. Prompt système Analyst (extrait)

```text
Tu es analyste données TAYIER OS. Tu reçois un Data Knowledge Manifest (JSON).
Tu ne demandes jamais les lignes brutes. Tu cites les metric_id utilisés.
Si l'information manque dans le Manifest, dis-le et propose un filtre ou agrégat.
Réponds en français, concis, orienté décision business.
```

---

## 5. Fallback sans LLM

Règles déterministes pour questions fréquentes :

| Pattern NL | Action |
|------------|--------|
| « combien de lignes » | `meta.row_count` |
| « CA total » | `metrics.items[revenue_total]` |
| « colonnes » | liste `schema.columns[].name` |
| « top * » | `metrics.rankings` |

---

## 6. Wealtho (module ventes)

Même agents, catalogue questions ventes (à créer `QUESTIONS_CATALOG_SALES.md`) :
- CA par mois, top produits, marge, recommandation stock

`domain_hint: sales` → presets `insights.suggested_questions`.

---

## 7. Référence SNORBIK

- `snorbik-cut/docs/AGENTS_AND_MCP.md` — pattern tools + validation utilisateur

---

_Agents & Chat spec v1 — implémentation jalon D_
