"""Dialogue gate for ambiguous columns and review workflow."""

from __future__ import annotations

from typing import Any


def build_dialogue_state(manifest: dict[str, Any]) -> dict[str, Any]:
    quality = manifest.get("quality", {})
    needs = quality.get("needs_user_review", False)
    ambiguous = quality.get("ambiguous_columns", [])
    chips = []
    if needs and ambiguous:
        for col in ambiguous[:3]:
            chips.append(
                {
                    "type": "confirm_type",
                    "column": col,
                    "label_fr": f"Confirmer le type de « {col} »",
                }
            )
    elif manifest.get("insights", {}).get("suggested_questions"):
        for q in manifest["insights"]["suggested_questions"][:5]:
            chips.append({"type": "question", "label_fr": q, "value": q})
    return {
        "needs_user_review": needs,
        "ambiguous_columns": ambiguous,
        "chips": chips,
        "confidence": quality.get("confidence"),
    }


def apply_type_confirmation(
    manifest: dict[str, Any], column: str, confirmed_type: str
) -> dict[str, Any]:
    updated = dict(manifest)
    schema = dict(updated.get("schema", {}))
    columns = []
    for col in schema.get("columns", []):
        if col["name"] == column:
            col = dict(col)
            col["inferred_type"] = confirmed_type
            col["filter_widget"] = _widget_for(confirmed_type)
            col["semantic_role"] = "measure" if confirmed_type in ("currency", "float", "integer") else "dimension"
        columns.append(col)
    schema["columns"] = columns
    updated["schema"] = schema
    quality = dict(updated.get("quality", {}))
    ambiguous = [c for c in quality.get("ambiguous_columns", []) if c != column]
    quality["ambiguous_columns"] = ambiguous
    quality["needs_user_review"] = len(ambiguous) > 0
    updated["quality"] = quality
    return updated


def _widget_for(inferred_type: str) -> str:
    mapping = {
        "currency": "numeric_range",
        "float": "numeric_range",
        "integer": "numeric_range",
        "datetime": "date_range",
        "category": "multi_select",
        "boolean": "multi_select",
        "text": "search_text",
    }
    return mapping.get(inferred_type, "multi_select")
