# Cahier des charges — Data Intelligence V1

_Version 1.0 — Juillet 2026_  
**Produit :** TAYIER OS — module analyse universelle CSV/Excel.

---

## 1. Contexte

**Projet actuel :** Python-Mastery-Nexus — plateforme Django visualisation DPE Paris (+800k lignes).  
**Évolution :** plateforme où **n'importe qui** upload **n'importe quel** Excel/CSV, le système **comprend** le contenu, filtre via sidebar dynamique, visualise, puis converse en NL.

**Référence méthodologique :** SNORBIK Cut V3 Knowledge Manifest (images → KM). Ici : **données tabulaires → DKM**.

---

## 2. Objectifs

| # | Objectif | Mesure |
|---|----------|--------|
| O1 | Comprendre un dataset inconnu à l'upload | DKM valide < 15 s (10k lignes) |
| O2 | Filtrer sans configuration manuelle | Sidebar 100 % auto depuis schema |
| O3 | Visualiser comme V1 mais générique | Chart + table sur tout CSV |
| O4 | Répondre en NL sans envoyer lignes brutes | Chat lit DKM only (ADR-002) |
| O5 | Automatiser 80 % du travail analyste | `needs_user_review` < 20 % corpus test |
| O6 | Ne pas casser dashboard DPE V1 | SC-REGRESSION-DPE vert |

---

## 3. Personas

### P1 — Analyste métier (commercial, ops)

- Upload ventes / stocks Excel
- Filtres sidebar, graphiques, export
- Pas de SQL, pas de Python

### P2 — Chargé mission rénovation (actuel Tayier)

- Dataset DPE ou exports métier
- Même outil, domaine rénovation ([QUESTIONS_CATALOG_DPE.md](./QUESTIONS_CATALOG_DPE.md))

### P3 — Développeur / intégrateur

- MCP tools pour agents Cursor
- API `/knowledge` pour automatisation

---

## 4. Périmètre V2.0 (Must)

| ID | Exigence | Phase |
|----|----------|-------|
| F01 | Upload CSV/XLSX/XLS | A |
| F02 | `analyze_dataset` → DKM | A |
| F03 | Bandeau résumé + confiance | A |
| F04 | Sidebar filtres dynamiques | B |
| F05 | Chart + tableau filtrés | B |
| F06 | Régression API `/api/dashboard/*` | REG |
| F07 | Auth Django existante | A |

---

## 5. Périmètre V2.1 (Should)

| ID | Exigence | Phase |
|----|----------|-------|
| F08 | Chat NL Analyst | D |
| F09 | Questions suggérées (chips) | D |
| F10 | Export rapport PDF/HTML | E |
| F11 | MCP tools | E |
| F12 | Module Wealtho (ventes) presets | D |

---

## 6. Hors scope V2.0

| Exclusion | Report |
|-----------|--------|
| SQL libre utilisateur | Sécurité |
| Jointures multi-fichiers | V3 |
| ML prédictif auto | V3 |
| Comptes / Stripe | Commercial |
| Big data > 1M lignes cluster | V3 (DuckDB local d'abord) |

---

## 7. Exigences non fonctionnelles

| ID | Exigence | Cible |
|----|----------|-------|
| NF01 | Analyse locale | Pas de cloud obligatoire |
| NF02 | RAM standard | 16 Go, 500k lignes pandas |
| NF03 | LLM optionnel | Ollama / OpenRouter + fallback règles |
| NF04 | Français UI | Labels, résumés, chat |
| NF05 | Traçabilité | `engines_trace` dans DKM |

---

## 8. Règle 80/20

| 80 % automatique | 20 % manuel |
|------------------|-------------|
| Inférence types | Confirmer colonne ambiguë |
| Stats descriptives | Choisir mesure si plusieurs candidats |
| Sidebar widgets | Corriger type datetime mal détecté |
| Chart par défaut | Valider avant export rapport |

---

## 9. Livrables documentation (jalon 0)

- [x] `docs/data_intelligence/` — ontologie complète
- [ ] Tests `tests/data_intelligence/` — SC-* (jalon A)
- [ ] `scripts/validate_data_platform.py` — parcours upload (jalon A)

---

## 10. Glossaire

| Terme | Définition |
|-------|------------|
| **DKM** | Data Knowledge Manifest — JSON anatomie dataset |
| **DKN_*** | Type de connaissance données |
| **Slice** | Tranche produite par un service avant fusion |
| **Wealtho** | Module ventes / CA (même plateforme, catalogue questions ventes) |
| **Legacy dashboard** | 6 JSON V1 DPE via TableFactory |

---

_CDC Data Intelligence V1 — Juillet 2026_
