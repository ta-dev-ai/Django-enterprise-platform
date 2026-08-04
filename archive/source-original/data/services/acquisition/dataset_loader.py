"""Load datasets from CSV/XLSX and produce loader metadata."""

from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import pandas as pd


def load_dataframe(path: Path, sheet: Optional[str] = None) -> pd.DataFrame:
    suffix = path.suffix.lower()
    if suffix in {".xlsx", ".xls"}:
        return pd.read_excel(path, sheet_name=sheet or 0)
    return pd.read_csv(path, low_memory=False)


def build_loader_meta(
    df: pd.DataFrame,
    *,
    dataset_id: str,
    filename: str,
    fmt: str,
    source: str = "user_upload",
    domain_hint: Optional[str] = None,
    file_bytes: Optional[bytes] = None,
) -> dict[str, Any]:
    sha = hashlib.sha256(file_bytes).hexdigest() if file_bytes else None
    return {
        "dataset_id": dataset_id,
        "filename": filename,
        "format": fmt,
        "sha256": sha,
        "uploaded_at": _now_iso(),
        "analyzed_at": _now_iso(),
        "row_count": int(len(df)),
        "column_count": int(len(df.columns)),
        "memory_bytes": int(df.memory_usage(deep=True).sum()),
        "source": source,
        "domain_hint": domain_hint,
    }


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
