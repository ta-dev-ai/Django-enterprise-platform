"""KM-only chat analyst with deterministic fallback."""

from __future__ import annotations

import json
import re
from typing import Any, Optional

from data.services.acquisition.dkm_context import audit_llm_context, dkm_planner_subset


def ask_data(manifest: dict[str, Any], message: str) -> dict[str, Any]:
    subset = dkm_planner_subset(manifest)
    violations = audit_llm_context(subset)
    if violations:
        return {
            "answer": "Contexte invalide pour l'analyse.",
            "citations": [],
            "context_audit": violations,
            "llm_used": False,
        }

    answer, citations, chart_spec = _deterministic_answer(subset, message)
    return {
        "answer": answer,
        "citations": citations,
        "chart_spec": chart_spec,
        "context_audit": [],
        "llm_used": False,
        "context_keys": list(subset.keys()),
    }


def _deterministic_answer(
    subset: dict[str, Any], message: str
) -> tuple[str, list[str], Optional[dict]]:
    lower = message.lower().strip()
    meta = subset.get("meta", {})
    citations: list[str] = []

    if re.search(r"combien de lignes|nombre de lignes|row", lower):
        count = meta.get("row_count", 0)
        return f"Le dataset contient {count:,} lignes.".replace(",", " "), ["meta.row_count"], None

    if re.search(r"colonnes|columns|champs", lower):
        names = [c["name"] for c in subset.get("schema", {}).get("columns", [])]
        return "Colonnes : " + ", ".join(names), ["schema.columns"], None

    if re.search(r"ca total|chiffre d'affaires|revenue", lower):
        for item in subset.get("metrics", {}).get("items", []):
            if item.get("id") in ("revenue_total",) or "montant" in item.get("source_columns", []):
                citations.append(f"metrics.items.{item['id']}")
                val = item.get("value", 0)
                unit = item.get("unit") or ""
                return f"Le CA total est {val:,.2f} {unit}.".replace(",", " "), citations, None

    if re.search(r"répartition|etiquette|dpe", lower):
        for col in subset.get("schema", {}).get("columns", []):
            if col.get("name") == "etiquette_dpe" and col.get("top_values"):
                parts = [f"{v['value']}: {v['count']}" for v in col["top_values"][:7]]
                return "Répartition DPE : " + ", ".join(parts), ["schema.columns.etiquette_dpe"], {
                    "type": "bar",
                    "x": "etiquette_dpe",
                    "y": "count",
                    "aggregation": "count",
                }

    if re.search(r"top|meilleur|plus vend", lower):
        rankings = subset.get("metrics", {}).get("rankings", [])
        if rankings:
            r = rankings[0]
            items = r.get("items", [])[:5]
            text = ", ".join(f"{i['value']} ({i['count']})" for i in items)
            return f"Top {r.get('column', '')} : {text}.", [f"metrics.rankings.{r['id']}"], {
                "type": "bar",
                "x": r.get("column"),
                "y": "count",
                "aggregation": "count",
            }

    summary = subset.get("insights", {}).get("summary_fr", "")
    if summary:
        return summary, ["insights.summary_fr"], None

    return (
        "Je n'ai pas trouvé cette information dans le manifeste. Essayez une question sur les lignes, colonnes ou métriques précalculées.",
        [],
        None,
    )


def build_llm_context(manifest: dict[str, Any], message: str) -> dict[str, Any]:
    """Build auditable LLM context — manifest subset only."""
    return {
        "manifest": dkm_planner_subset(manifest),
        "message": message,
    }
