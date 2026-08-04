"""French insights and suggested questions."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Optional


DPE_QUESTIONS = [
    "Quelle est la répartition des étiquettes DPE ?",
    "Quels codes postaux concentrent le plus de logements ?",
    "Quel est le coût énergétique moyen ?",
]

SALES_QUESTIONS = [
    "Quel est le CA total ?",
    "Quel est le CA par mois ?",
    "Quels produits vendent le plus ?",
]

UNIVERSAL_QUESTIONS = [
    "Combien de lignes contient ce dataset ?",
    "Quelles sont les colonnes disponibles ?",
    "Quelles colonnes ont des valeurs manquantes ?",
]


def compose_insights(
    meta: dict,
    columns: list[dict],
    metrics: dict,
    *,
    domain_hint: Optional[str] = None,
) -> dict[str, Any]:
    detected = _detect_domain(columns, domain_hint)
    summary = _summary_fr(meta, columns, metrics, detected)
    questions = _suggested_questions(detected, columns)
    return {
        "summary_fr": summary,
        "detected_domain": detected,
        "suggested_questions": questions,
        "engines_trace_entry": {
            "service": "InsightComposer",
            "engine": "template",
            "at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        },
    }


def _detect_domain(columns: list[dict], hint: Optional[str]) -> str:
    if hint:
        return hint
    names = {c["name"] for c in columns}
    if "etiquette_dpe" in names or "numero_dpe" in names:
        return "renovation_dpe"
    if any(n in names for n in ("montant", "produit", "date_vente")):
        return "sales"
    return "generic"


def _summary_fr(meta: dict, columns: list[dict], metrics: dict, domain: str) -> str:
    rows = meta.get("row_count", 0)
    cols = meta.get("column_count", 0)
    parts = [f"{rows:,}".replace(",", " "), f"{cols} colonnes"]
    time_cols = [c for c in columns if c.get("semantic_role") == "time_dimension"]
    if time_cols and time_cols[0].get("stats"):
        stats = time_cols[0]["stats"]
        parts.append(f"période {stats.get('min', '?')}–{stats.get('max', '?')}")
    revenue = next(
        (m for m in metrics.get("items", []) if m.get("id") == "revenue_total"),
        None,
    )
    if revenue:
        val = revenue["value"]
        parts.append(f"CA total {val:,.0f} €".replace(",", " "))
    if domain == "renovation_dpe":
        etiq = next((c for c in columns if c["name"] == "etiquette_dpe"), None)
        if etiq and etiq.get("top_values"):
            labels = ", ".join(v["value"] for v in etiq["top_values"][:7])
            parts.append(f"étiquettes DPE : {labels}")
    return ", ".join(parts) + "."


def _suggested_questions(domain: str, columns: list[dict]) -> list[str]:
    if domain == "renovation_dpe":
        return DPE_QUESTIONS
    if domain == "sales":
        return SALES_QUESTIONS
    return UNIVERSAL_QUESTIONS[:2] + [
        f"Quelle est la distribution de {columns[0]['name']} ?"
        for _ in [0]
        if columns
    ][:1]
