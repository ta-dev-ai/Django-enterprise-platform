"""Orchestrate dataset analysis into DKM."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Optional

import pandas as pd

from data.dataset_store import (
    is_builtin,
    load_manifest,
    save_manifest,
    source_path,
    builtin_manifest_cache,
)
from data.services.acquisition.dataset_loader import build_loader_meta, load_dataframe
from data.services.acquisition.insight_composer import compose_insights
from data.services.acquisition.knowledge_builder import KnowledgeBuilder
from data.services.acquisition.metric_aggregator import aggregate_metrics
from data.services.acquisition.quality_analyzer import analyze_quality
from data.services.acquisition.schema_profiler import profile_schema
from data.services.acquisition.type_inferencer import infer_types


def analyze_dataframe(
    df: pd.DataFrame,
    *,
    dataset_id: str,
    filename: str = "dataset.csv",
    fmt: str = "csv",
    source: str = "user_upload",
    domain_hint: Optional[str] = None,
) -> dict[str, Any]:
    meta = build_loader_meta(
        df,
        dataset_id=dataset_id,
        filename=filename,
        fmt=fmt,
        source=source,
        domain_hint=domain_hint,
    )
    schema_slice = profile_schema(df)
    type_slice = infer_types(df, schema_slice["columns"])
    columns = type_slice["columns"]
    quality = analyze_quality(df, columns)
    metrics = aggregate_metrics(df, columns)
    insights = compose_insights(meta, columns, metrics, domain_hint=domain_hint)
    manifest = KnowledgeBuilder().build(
        meta,
        schema_slice,
        type_slice,
        quality,
        metrics,
        insights,
    )
    return manifest


def get_or_build_manifest(
    dataset_id: str,
    *,
    force: bool = False,
    domain_hint: Optional[str] = None,
) -> dict[str, Any]:
    if not force:
        cached = load_manifest(dataset_id)
        if cached:
            return cached

    path = source_path(dataset_id)
    if path is None or not path.exists():
        raise FileNotFoundError(f"No source data for dataset {dataset_id}")

    df = load_dataframe(path)
    source = "builtin_dpe" if is_builtin(dataset_id) else "user_upload"
    hint = domain_hint or ("renovation_dpe" if is_builtin(dataset_id) else None)
    manifest = analyze_dataframe(
        df,
        dataset_id=dataset_id,
        filename=path.name,
        fmt=path.suffix.lstrip(".") or "csv",
        source=source,
        domain_hint=hint,
    )
    if is_builtin(dataset_id):
        cache_path = builtin_manifest_cache()
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        import json

        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2, default=str)
    else:
        save_manifest(dataset_id, manifest)
    return manifest
