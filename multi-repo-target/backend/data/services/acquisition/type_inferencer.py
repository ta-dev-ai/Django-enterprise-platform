"""Heuristic column type inference."""

from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Any

import pandas as pd

CURRENCY_HINTS = ("montant", "prix", "cout", "cost", "amount", "revenue", "ca", "total")
GEO_HINTS = ("code_postal", "postal", "zip", "lat", "lon", "geo")
ID_HINTS = ("numero_", "id_", "_id", "uuid", "ref_")
TIME_HINTS = ("date", "time", "jour", "mois", "annee", "year", "created", "updated")
DPE_DOMAIN_COLUMNS = frozenset(
    {"etiquette_dpe", "etiquette_ges", "code_postal_ban", "numero_dpe", "type_batiment"}
)


def infer_types(df: pd.DataFrame, base_columns: list[dict]) -> dict[str, Any]:
    enriched = []
    for col_meta in base_columns:
        name = col_meta["name"]
        series = df[name]
        inferred = _infer_column(name, series)
        enriched.append({**col_meta, **inferred})
    schema = _build_schema_summary(enriched)
    return {
        "columns": enriched,
        "schema_summary": schema,
        "engines_trace_entry": {
            "service": "TypeInferencer",
            "engine": "heuristic",
            "at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        },
    }


def _infer_column(name: str, series: pd.Series) -> dict[str, Any]:
    lower = name.lower()
    non_null = series.dropna()
    distinct = int(non_null.nunique())
    cardinality = _cardinality(distinct, len(non_null))
    result: dict[str, Any] = {
        "distinct_count": distinct,
        "cardinality": cardinality,
    }

    if distinct == 0 or series.isna().all():
        result.update(
            {
                "inferred_type": "unknown",
                "filter_widget": None,
                "semantic_role": None,
                "sample_values": [],
            }
        )
        return result

    if _is_datetime(series, lower):
        stats = _datetime_stats(non_null)
        result.update(
            {
                "inferred_type": "datetime",
                "filter_widget": "date_range",
                "semantic_role": "time_dimension",
                "stats": stats,
                "sample_values": _sample(non_null, 3),
            }
        )
        return result

    if _is_boolean(series):
        result.update(
            {
                "inferred_type": "boolean",
                "filter_widget": "multi_select",
                "semantic_role": "dimension",
                "top_values": _top_values(non_null, 2),
                "sample_values": _sample(non_null, 2),
            }
        )
        return result

    if pd.api.types.is_numeric_dtype(series):
        inferred = _numeric_type(lower)
        result.update(
            {
                "inferred_type": inferred,
                "filter_widget": "numeric_range",
                "semantic_role": "measure",
                "stats": _numeric_stats(non_null),
                "sample_values": _sample(non_null, 3),
            }
        )
        return result

    if _looks_like_id(lower, distinct, len(non_null)):
        result.update(
            {
                "inferred_type": "id",
                "filter_widget": "search_text",
                "semantic_role": "identifier",
                "sample_values": _sample(non_null, 3),
            }
        )
        return result

    if any(h in lower for h in GEO_HINTS) or name in DPE_DOMAIN_COLUMNS:
        widget = "chips" if name == "etiquette_dpe" else "multi_select"
        result.update(
            {
                "inferred_type": "geo" if "postal" in lower or "code_postal" in lower else "category",
                "filter_widget": widget,
                "semantic_role": "dimension",
                "top_values": _top_values(non_null, 20),
                "sample_values": _sample(non_null, 3),
            }
        )
        return result

    if distinct <= 50:
        widget = "chips" if name == "etiquette_dpe" else "multi_select"
        result.update(
            {
                "inferred_type": "category",
                "filter_widget": widget,
                "semantic_role": "dimension",
                "top_values": _top_values(non_null, 50),
                "sample_values": _sample(non_null, 3),
            }
        )
        return result

    avg_len = non_null.astype(str).str.len().mean()
    if avg_len > 50:
        result.update(
            {
                "inferred_type": "text",
                "filter_widget": "search_text",
                "semantic_role": "dimension",
                "sample_values": _sample(non_null, 2),
            }
        )
    elif distinct <= 500:
        result.update(
            {
                "inferred_type": "category",
                "filter_widget": "search_select",
                "semantic_role": "dimension",
                "top_values": _top_values(non_null, 20),
                "sample_values": _sample(non_null, 3),
            }
        )
    else:
        result.update(
            {
                "inferred_type": "text",
                "filter_widget": "search_text",
                "semantic_role": "dimension",
                "sample_values": _sample(non_null, 2),
            }
        )
    return result


def _build_schema_summary(columns: list[dict]) -> dict[str, Any]:
    pk = [c["name"] for c in columns if c.get("inferred_type") == "id"]
    time_col = next(
        (c["name"] for c in columns if c.get("semantic_role") == "time_dimension"),
        None,
    )
    measures = [c["name"] for c in columns if c.get("semantic_role") == "measure"]
    dimensions = [
        c["name"]
        for c in columns
        if c.get("semantic_role") == "dimension" and c.get("inferred_type") != "text"
    ]
    return {
        "primary_key_candidate": pk[:3],
        "time_column_candidate": time_col,
        "measure_columns": measures,
        "dimension_columns": dimensions,
    }


def _cardinality(distinct: int, total: int) -> str:
    if total == 0:
        return "low"
    ratio = distinct / total
    if distinct <= 50:
        return "low"
    if distinct <= 500 or ratio < 0.05:
        return "medium"
    return "high"


def _is_datetime(series: pd.Series, lower: str) -> bool:
    if pd.api.types.is_datetime64_any_dtype(series):
        return True
    if not any(h in lower for h in TIME_HINTS):
        return False
    parsed = pd.to_datetime(series, errors="coerce", dayfirst=False)
    return parsed.notna().mean() > 0.8


def _datetime_stats(series: pd.Series) -> dict[str, str]:
    parsed = pd.to_datetime(series, errors="coerce", dayfirst=False)
    valid = parsed.dropna()
    if valid.empty:
        return {}
    return {
        "min": valid.min().strftime("%Y-%m-%d"),
        "max": valid.max().strftime("%Y-%m-%d"),
    }


def _is_boolean(series: pd.Series) -> bool:
    values = set(series.dropna().astype(str).str.lower().unique())
    return values.issubset({"true", "false", "0", "1", "oui", "non", "yes", "no"})


def _numeric_type(lower: str) -> str:
    if any(h in lower for h in CURRENCY_HINTS):
        return "currency"
    if "count" in lower or lower.endswith("_id"):
        return "integer"
    return "float"


def _numeric_stats(series: pd.Series) -> dict[str, float]:
    nums = pd.to_numeric(series, errors="coerce").dropna()
    if nums.empty:
        return {}
    return {
        "min": round(float(nums.min()), 2),
        "max": round(float(nums.max()), 2),
        "mean": round(float(nums.mean()), 2),
        "median": round(float(nums.median()), 2),
    }


def _looks_like_id(lower: str, distinct: int, total: int) -> bool:
    if total == 0:
        return False
    if any(h in lower for h in ID_HINTS):
        return distinct / total > 0.9
    return distinct / total > 0.98


def _top_values(series: pd.Series, limit: int) -> list[dict]:
    counts = series.astype(str).value_counts().head(limit)
    return [{"value": str(idx), "count": int(cnt)} for idx, cnt in counts.items()]


def _sample(series: pd.Series, n: int) -> list:
    return [str(v) for v in series.dropna().head(n).tolist()]
