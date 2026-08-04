# Scénarios d'acceptation — Data Intelligence

_Version 1.0 — Juillet 2026_  
Critères testables pour validation V2 et régression V1.

---

## SC-UNIVERSAL-01 — Upload CSV ventes inconnu (happy path)

**Précondition :** utilisateur authentifié, fichier `ventes_sample.csv` (10 000 lignes, colonnes date/produit/montant/région).

1. POST upload → `dataset_id`
2. POST analyze → DKM en < 15 s
3. `meta.row_count` = 10000
4. `schema.columns` ≥ 4, types inférés correctement (date, category, currency)
5. `insights.summary_fr` non vide
6. GET sidebar → ≥ 3 filtres
7. POST filter `{ produit: in [X] }` → `filtered_row_count` < 10000
8. POST chart → données bar chart non vides

**Résultat :** PASS si 1–8 OK.

---

## SC-UNIVERSAL-02 — Fichier ambigu (20 % manuel)

**Précondition :** CSV colonne `amount` mix texte/nombre.

1. Analyze → `quality.needs_user_review` = true
2. `quality.ambiguous_columns` contient `amount`
3. UI modal confirmation type
4. Utilisateur confirme `currency`
5. DKM mis à jour → sidebar `numeric_range` sur `amount`

**Résultat :** workflow review sans crash.

---

## SC-UNIVERSAL-03 — Excel multi-feuilles

**Précondition :** `rapport.xlsx` 2 feuilles.

1. Upload → prompt ou auto première feuille non vide
2. DKM `meta.format` = xlsx
3. Analyze feuille sélectionnée OK

**Résultat :** au minimum feuille 1 analysée ; feuille 2 documentée hors scope V2.0 si non implémenté.

---

## SC-REGRESSION-DPE — Dashboard V1 équivalent

**Précondition :** pipeline DPE exécuté, dataset builtin `dpe_paris`.

1. GET `/api/dashboard/table_financial/` → 200
2. GET `/api/datasets/dpe_paris/knowledge` → DKM avec domaine `renovation_dpe`
3. Charts batiment/dpe/types affichent données équivalentes V1
4. Sidebar contient `etiquette_dpe` en chips A–G

**Résultat :** aucune régression visuelle majeure.

---

## SC-CHAT-01 — Question NL sans CSV brut (jalon D)

**Précondition :** DKM ventes complet, LLM mock ou réel.

1. POST chat `{ message: "Quel est le CA total ?" }`
2. Réponse cite `metrics.items[revenue_total]`
3. Contexte LLM audit : pas de clé `raw_rows` / pas de 10k lignes

**Résultat :** ADR-002 respecté.

---

## SC-CHAT-02 — Recommandation métier (jalon D)

1. POST chat `{ message: "Quel produit pousser ce trimestre ?" }`
2. Réponse utilise `metrics.rankings` ou lazy agg
3. Optionnel : `chart_spec` bar top produits

---

## SC-SIDEBAR — Tests widgets

| ID | Test | Critère |
|----|------|---------|
| SB-01 | 5 colonnes typées | 5 widgets |
| SB-02 | category 3 valeurs | multi_select 3 options |
| SB-03 | date between | row_count filtré |
| SB-04 | colonne 100 % null | absente sidebar |
| SB-05 | DPE etiquette | chips A–G |

---

## SC-PERF-01 — Performance

| Taille | Analyze max | Filter max |
|--------|-------------|------------|
| 10k lignes | 15 s | 2 s |
| 100k lignes | 60 s | 5 s |
| 500k lignes | 180 s (warn) | 10 s |

---

## Matrice tests (cible)

| Scénario | pytest | manuel UI | validate_script |
|----------|--------|-----------|-----------------|
| SC-UNIVERSAL-01 | ✅ | ✅ | ✅ |
| SC-REGRESSION-DPE | ✅ | ✅ | ✅ |
| SC-CHAT-01 | ✅ | — | — |
| SB-01–05 | ✅ | ✅ | — |

---

_Scénarios d'acceptation v1 — à implémenter dans `tests/data_intelligence/`_
