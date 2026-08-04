"""Dataset quality scoring."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import pandas as pd


def analyze_quality(df: pd.DataFrame, columns: list[dict]) -> dict[str, Any]:
    ambiguous = [
        c["name"]
        for c in columns
        if c.get("inferred_type") == "unknown" or c.get("null_rate", 0) > 0.5
    ]
    empty_names = sum(1 for c in df.columns if not str(c).strip())
    dupes = int(df.duplicated().sum()) if len(df) else 0
    completeness = _completeness(columns)
    type_conf = _type_confidence(columns)
    schema_conf = 1.0 - (empty_names / max(len(df.columns), 1))
    confidence = round((schema_conf + type_conf + completeness) / 3, 2)
    needs_review = confidence < 0.7 or len(ambiguous) > 0
    return {
        "confidence": confidence,
        "needs_user_review": needs_review,
        "review_threshold": 0.7,
        "duplicate_row_count": dupes,
        "empty_column_names": empty_names,
        "ambiguous_columns": ambiguous,
        "validation": {"ok": not needs_review, "errors": []},
        "breakdown": {
            "schema_confidence": round(schema_conf, 2),
            "type_inference_confidence": round(type_conf, 2),
            "completeness_score": round(completeness, 2),
        },
        "engines_trace_entry": {
            "service": "QualityAnalyzer",
            "engine": "heuristic",
            "at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        },
    }


def _completeness(columns: list[dict]) -> float:
    if not columns:
        return 0.0
    scores = [1.0 - min(c.get("null_rate", 0), 1.0) for c in columns]
    return sum(scores) / len(scores)


def _type_confidence(columns: list[dict]) -> float:
    if not columns:
        return 0.0
    known = sum(1 for c in columns if c.get("inferred_type") not in (None, "unknown"))
    return known / len(columns)
