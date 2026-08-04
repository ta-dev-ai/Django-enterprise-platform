"""Column profiling for Data Knowledge Manifest."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import pandas as pd


def profile_schema(df: pd.DataFrame) -> dict[str, Any]:
    columns = []
    for name in df.columns:
        series = df[name]
        null_count = int(series.isna().sum())
        row_count = max(len(df), 1)
        null_rate = round(null_count / row_count, 4)
        distinct = int(series.nunique(dropna=True))
        columns.append(
            {
                "name": str(name),
                "pandas_dtype": str(series.dtype),
                "nullable": null_count > 0,
                "null_count": null_count,
                "null_rate": null_rate,
                "distinct_count": distinct,
            }
        )
    return {
        "columns": columns,
        "engines_trace_entry": _trace("SchemaProfiler", "pandas"),
    }


def _trace(service: str, engine: str) -> dict[str, str]:
    return {
        "service": service,
        "engine": engine,
        "at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
