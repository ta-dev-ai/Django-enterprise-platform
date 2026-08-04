"""File-based dataset storage for Data Intelligence V2."""

from __future__ import annotations

import json
import shutil
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

from django.conf import settings

BUILTIN_DPE_IDS = frozenset({"builtin-dpe", "dpe_paris"})


def datasets_root() -> Path:
    return Path(settings.BASE_DIR) / "data" / "datasets"


def dataset_dir(dataset_id: str) -> Path:
    return datasets_root() / dataset_id


def is_builtin(dataset_id: str) -> bool:
    return dataset_id in BUILTIN_DPE_IDS


def resolve_dataset_id(dataset_id: str) -> str:
    if dataset_id in BUILTIN_DPE_IDS:
        return "builtin-dpe"
    return dataset_id


def create_dataset_id() -> str:
    return str(uuid.uuid4())


def save_upload(dataset_id: str, uploaded_file) -> Path:
    dest = dataset_dir(dataset_id)
    dest.mkdir(parents=True, exist_ok=True)
    ext = Path(uploaded_file.name).suffix.lower() or ".csv"
    target = dest / f"source{ext}"
    with open(target, "wb") as out:
        for chunk in uploaded_file.chunks():
            out.write(chunk)
    meta = {
        "dataset_id": dataset_id,
        "filename": uploaded_file.name,
        "format": ext.lstrip("."),
        "uploaded_at": _now_iso(),
    }
    _write_json(dest / "upload_meta.json", meta)
    return target


def save_manifest(dataset_id: str, manifest: dict[str, Any]) -> Path:
    dest = dataset_dir(dataset_id)
    dest.mkdir(parents=True, exist_ok=True)
    path = dest / "knowledge_manifest.json"
    _write_json(path, manifest)
    return path


def load_manifest(dataset_id: str) -> Optional[dict[str, Any]]:
    dataset_id = resolve_dataset_id(dataset_id)
    if is_builtin(dataset_id):
        builtin_cache = builtin_manifest_cache()
        if builtin_cache.exists():
            return _read_json(builtin_cache)
    path = dataset_dir(dataset_id) / "knowledge_manifest.json"
    if path.exists():
        return _read_json(path)
    return None


def source_path(dataset_id: str) -> Optional[Path]:
    dataset_id = resolve_dataset_id(dataset_id)
    if is_builtin(dataset_id):
        return _builtin_source_path()
    dest = dataset_dir(dataset_id)
    for name in ("source.csv", "source.xlsx", "source.xls"):
        candidate = dest / name
        if candidate.exists():
            return candidate
    return None


def builtin_manifest_cache() -> Path:
    return (
        Path(settings.BASE_DIR)
        / "data"
        / "services"
        / "data_processing"
        / "export_dashboard"
        / "knowledge_manifest.json"
    )


def _builtin_source_path() -> Optional[Path]:
    fixture = (
        Path(settings.BASE_DIR)
        / "data"
        / "services"
        / "acquisition"
        / "fixtures"
        / "dpe_builtin_sample.csv"
    )
    if fixture.exists():
        return fixture
    light = (
        Path(settings.BASE_DIR)
        / "data"
        / "services"
        / "data_processing"
        / "data_light_output"
        / "dpe03existant_paris_light.csv"
    )
    if light.exists():
        return light
    raw = (
        Path(settings.BASE_DIR)
        / "data"
        / "services"
        / "data_processing"
        / "data_source_inputs"
        / "dpe03existant_paris.csv"
    )
    if raw.exists():
        return raw
    return fixture if fixture.exists() else None


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _write_json(path: Path, data: dict) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2, default=str)


def _read_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def delete_dataset(dataset_id: str) -> None:
    dest = dataset_dir(dataset_id)
    if dest.exists() and not is_builtin(dataset_id):
        shutil.rmtree(dest)
