"""Precomputed metrics from schema and dataframe."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import pandas as pd


def aggregate_metrics(df: pd.DataFrame, columns: list[dict]) -> dict[str, Any]:
    items = []
    rankings = []
    measures = [c for c in columns if c.get("semantic_role") == "measure"]
    dimensions = [c for c in columns if c.get("inferred_type") == "category"]

    for col in measures:
        name = col["name"]
        nums = pd.to_numeric(df[name], errors="coerce").dropna()
        if nums.empty:
            continue
        total = round(float(nums.sum()), 2)
        items.append(
            {
                "id": f"sum_{name}",
                "label_fr": f"Total {name.replace('_', ' ')}",
                "value": total,
                "unit": "EUR" if col.get("inferred_type") == "currency" else None,
                "source_columns": [name],
                "aggregation": "sum",
            }
        )
        if col.get("inferred_type") == "currency":
            items.append(
                {
                    "id": "revenue_total",
                    "label_fr": "Chiffre d'affaires total",
                    "value": total,
                    "unit": "EUR",
                    "source_columns": [name],
                    "aggregation": "sum",
                }
            )

    for dim in dimensions[:3]:
        name = dim["name"]
        top = (
            df[name]
            .astype(str)
            .value_counts()
            .head(10)
            .reset_index()
        )
        if top.empty:
            continue
        rankings.append(
            {
                "id": f"top_{name}",
                "label_fr": f"Top {name.replace('_', ' ')}",
                "column": name,
                "items": [
                    {"value": str(row.iloc[0]), "count": int(row.iloc[1])}
                    for _, row in top.iterrows()
                ],
            }
        )

    return {
        "precomputed": True,
        "items": items,
        "by_time": [],
        "rankings": rankings,
        "engines_trace_entry": {
            "service": "MetricAggregator",
            "engine": "pandas",
            "at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        },
    }
