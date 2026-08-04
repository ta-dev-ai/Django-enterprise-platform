"""Apply sidebar filters to a dataframe."""

from __future__ import annotations

from typing import Any

import pandas as pd


def apply_filters(df: pd.DataFrame, filters: dict[str, Any]) -> pd.DataFrame:
    result = df.copy()
    for column, spec in (filters or {}).items():
        if column not in result.columns:
            continue
        op = spec.get("op", "in")
        series = result[column]
        if op == "in":
            values = spec.get("values", [])
            result = result[series.astype(str).isin([str(v) for v in values])]
        elif op == "not_in":
            values = spec.get("values", [])
            result = result[~series.astype(str).isin([str(v) for v in values])]
        elif op == "between":
            lo, hi = spec.get("min"), spec.get("max")
            if pd.api.types.is_numeric_dtype(series):
                nums = pd.to_numeric(series, errors="coerce")
                result = result[nums.between(float(lo), float(hi))]
            else:
                parsed = pd.to_datetime(series, errors="coerce", dayfirst=False)
                lo_dt = pd.to_datetime(lo, errors="coerce", dayfirst=False)
                hi_dt = pd.to_datetime(hi, errors="coerce", dayfirst=False)
                if parsed.notna().any() and pd.notna(lo_dt) and pd.notna(hi_dt):
                    mask = (parsed >= lo_dt) & (parsed <= hi_dt)
                    result = result[mask.fillna(False)]
                else:
                    as_str = series.astype(str)
                    result = result[(as_str >= str(lo)) & (as_str <= str(hi))]
        elif op == "contains":
            needle = str(spec.get("value", "")).lower()
            result = result[series.astype(str).str.lower().str.contains(needle, na=False)]
        elif op == "eq":
            result = result[series.astype(str) == str(spec.get("value", ""))]
        elif op == "is_null":
            result = result[series.isna()]
        elif op == "is_not_null":
            result = result[series.notna()]
    return result


def filter_preview(df: pd.DataFrame, filters: dict[str, Any], limit: int = 20) -> dict[str, Any]:
    filtered = apply_filters(df, filters)
    preview = filtered.head(limit).replace({pd.NA: None}).where(pd.notnull(filtered.head(limit)), None)
    rows = preview.to_dict(orient="records")
    return {
        "filtered_row_count": int(len(filtered)),
        "total_row_count": int(len(df)),
        "preview_rows": rows,
        "applied_filters": filters or {},
    }
