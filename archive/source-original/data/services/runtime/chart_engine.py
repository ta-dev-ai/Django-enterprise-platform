"""Generic chart data from DKM and dataframe."""

from __future__ import annotations

from typing import Any, Optional

import pandas as pd


def build_chart_data(
    df: pd.DataFrame,
    manifest: dict[str, Any],
    chart_spec: Optional[dict[str, Any]] = None,
) -> dict[str, Any]:
    spec = chart_spec or manifest.get("views", {}).get("default_chart", {})
    chart_type = spec.get("type", "table")
    x = spec.get("x")
    y = spec.get("y", "count")
    agg = spec.get("aggregation", "sum")

    if chart_type == "table":
        cols = spec.get("columns") or [c["name"] for c in manifest.get("schema", {}).get("columns", [])[:8]]
        preview = df[cols].head(50) if all(c in df.columns for c in cols) else df.head(50)
        return {
            "chart_spec": {"type": "table", "columns": cols},
            "data": {"rows": preview.replace({pd.NA: None}).to_dict(orient="records")},
        }

    if not x or x not in df.columns:
        return {"chart_spec": spec, "data": {"categories": [], "series": []}}

    if chart_type == "line" and agg == "sum":
        time_series = pd.to_datetime(df[x], errors="coerce", dayfirst=True)
        work = df.copy()
        work["_period"] = time_series.dt.to_period("M").astype(str)
        if y not in work.columns:
            grouped = work.groupby("_period").size()
        else:
            nums = pd.to_numeric(work[y], errors="coerce")
            grouped = work.assign(_y=nums).groupby("_period")["_y"].sum()
        return {
            "chart_spec": spec,
            "data": {
                "categories": grouped.index.tolist(),
                "series": [{"name": y, "data": [round(float(v), 2) for v in grouped.values]}],
            },
        }

    if y == "count" or y not in df.columns:
        grouped = df[x].astype(str).value_counts().head(30)
        return {
            "chart_spec": spec,
            "data": {
                "categories": grouped.index.tolist(),
                "series": [{"name": "count", "data": [int(v) for v in grouped.values]}],
            },
        }

    nums = pd.to_numeric(df[y], errors="coerce")
    work = df.assign(_y=nums)
    if agg == "sum":
        grouped = work.groupby(work[x].astype(str))["_y"].sum().sort_values(ascending=False).head(30)
    elif agg == "mean":
        grouped = work.groupby(work[x].astype(str))["_y"].mean().sort_values(ascending=False).head(30)
    else:
        grouped = work.groupby(work[x].astype(str))["_y"].count().sort_values(ascending=False).head(30)

    return {
        "chart_spec": spec,
        "data": {
            "categories": grouped.index.tolist(),
            "series": [{"name": y, "data": [round(float(v), 2) for v in grouped.values]}],
        },
    }
