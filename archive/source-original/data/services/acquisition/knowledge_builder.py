"""Merge acquisition slices into Data Knowledge Manifest."""

from __future__ import annotations

from typing import Any, Optional


class KnowledgeBuilder:
    def build(
        self,
        meta: dict,
        schema_slice: dict,
        type_slice: dict,
        quality: dict,
        metrics: dict,
        insights: dict,
        *,
        legacy_dashboard: Optional[dict] = None,
    ) -> dict[str, Any]:
        trace = []
        for key in ("schema_slice", "type_slice", "quality", "metrics", "insights"):
            pass
        for entry in [
            schema_slice.get("engines_trace_entry"),
            type_slice.get("engines_trace_entry"),
            quality.get("engines_trace_entry"),
            metrics.get("engines_trace_entry"),
            insights.get("engines_trace_entry"),
        ]:
            if entry:
                trace.append(entry)

        columns = type_slice["columns"]
        schema_summary = type_slice.get("schema_summary", {})
        default_chart = _default_chart(columns, schema_summary)

        quality_out = {k: v for k, v in quality.items() if k != "engines_trace_entry"}
        metrics_out = {k: v for k, v in metrics.items() if k != "engines_trace_entry"}
        insights_out = {k: v for k, v in insights.items() if k != "engines_trace_entry"}

        return {
            "dkm_version": "1.0",
            "meta": meta,
            "schema": {
                "columns": columns,
                **schema_summary,
            },
            "metrics": metrics_out,
            "quality": quality_out,
            "insights": insights_out,
            "views": {
                "legacy_dashboard": legacy_dashboard,
                "default_chart": default_chart,
            },
            "engines_trace": trace,
        }


def _default_chart(columns: list[dict], summary: dict) -> dict:
    dims = summary.get("dimension_columns") or [
        c["name"] for c in columns if c.get("semantic_role") == "dimension"
    ]
    measures = summary.get("measure_columns") or [
        c["name"] for c in columns if c.get("semantic_role") == "measure"
    ]
    time_col = summary.get("time_column_candidate")

    if time_col and measures:
        return {
            "type": "line",
            "x": time_col,
            "y": measures[0],
            "aggregation": "sum",
        }
    if dims and measures:
        dim = dims[0]
        col = next((c for c in columns if c["name"] == dim), None)
        agg = "sum"
        chart_type = "bar"
        if col and col.get("cardinality") == "low":
            chart_type = "bar"
        return {"type": chart_type, "x": dim, "y": measures[0], "aggregation": agg}
    if dims:
        return {"type": "bar", "x": dims[0], "y": "count", "aggregation": "count"}
    return {"type": "table", "columns": [c["name"] for c in columns[:8]]}
