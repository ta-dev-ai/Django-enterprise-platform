"""ADR-002 — LLM context subset and audit."""

from __future__ import annotations

from typing import Any

FORBIDDEN_KEYS = frozenset(
    {
        "raw_rows",
        "full_data",
        "file_path_absolu",
        "credentials",
        "dataframe",
        "rows",
    }
)


def dkm_planner_subset(manifest: dict[str, Any]) -> dict[str, Any]:
    meta = dict(manifest.get("meta", {}))
    meta.pop("sha256", None)
    columns = []
    for col in manifest.get("schema", {}).get("columns", []):
        slim = {k: v for k, v in col.items() if k != "sample_values"}
        if "top_values" in slim and len(slim.get("top_values", [])) > 10:
            slim["top_values"] = slim["top_values"][:10]
        columns.append(slim)
    return {
        "dkm_version": manifest.get("dkm_version"),
        "meta": meta,
        "schema": {
            "columns": columns,
            "measure_columns": manifest.get("schema", {}).get("measure_columns", []),
            "dimension_columns": manifest.get("schema", {}).get("dimension_columns", []),
            "time_column_candidate": manifest.get("schema", {}).get("time_column_candidate"),
        },
        "metrics": {
            "precomputed": manifest.get("metrics", {}).get("precomputed"),
            "items": manifest.get("metrics", {}).get("items", []),
            "rankings": manifest.get("metrics", {}).get("rankings", []),
        },
        "quality": {
            "confidence": manifest.get("quality", {}).get("confidence"),
            "needs_user_review": manifest.get("quality", {}).get("needs_user_review"),
            "ambiguous_columns": manifest.get("quality", {}).get("ambiguous_columns", []),
        },
        "insights": {
            "summary_fr": manifest.get("insights", {}).get("summary_fr"),
            "suggested_questions": manifest.get("insights", {}).get("suggested_questions", []),
            "detected_domain": manifest.get("insights", {}).get("detected_domain"),
        },
    }


def audit_llm_context(context: dict[str, Any]) -> list[str]:
    violations: list[str] = []

    def walk(obj: Any, path: str = "") -> None:
        if isinstance(obj, dict):
            for key, value in obj.items():
                full = f"{path}.{key}" if path else key
                if key in FORBIDDEN_KEYS:
                    violations.append(f"forbidden key: {full}")
                if key == "data" and isinstance(value, list) and len(value) > 50:
                    violations.append(f"large raw data at {full} ({len(value)} rows)")
                walk(value, full)
        elif isinstance(obj, list) and len(obj) > 200:
            violations.append(f"large list at {path} ({len(obj)} items)")

    walk(context)
    return violations
