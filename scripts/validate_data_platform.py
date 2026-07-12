#!/usr/bin/env python
"""Validate Data Intelligence platform end-to-end."""

from __future__ import annotations

import json
import sys
import tempfile
import time
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import django

os_env = __import__("os")
os_env.environ.setdefault("DJANGO_SETTINGS_MODULE", "batimentRenovation.settings")
django.setup()

from data.dataset_store import save_manifest, save_upload  # noqa: E402
from data.services.acquisition.analyze_service import analyze_dataframe, get_or_build_manifest  # noqa: E402
from data.services.runtime.chart_engine import build_chart_data  # noqa: E402
from data.services.runtime.filter_engine import filter_preview  # noqa: E402
from data.services.runtime.sidebar_generator import generate_sidebar  # noqa: E402


def _make_sales_csv(path: Path, rows: int = 1000) -> None:
    import random
    from datetime import date, timedelta

    random.seed(7)
    products = ["Widget A", "Widget B", "Widget C"]
    regions = ["Nord", "Sud", "Est", "Ouest"]
    data = []
    for i in range(rows):
        data.append(
            {
                "date_vente": (date(2024, 1, 1) + timedelta(days=i % 365)).isoformat(),
                "produit": random.choice(products),
                "montant": round(random.uniform(10, 500), 2),
                "region": random.choice(regions),
            }
        )
    pd.DataFrame(data).to_csv(path, index=False)


def run() -> int:
    errors = []
    print("1. Builtin DPE knowledge...")
    try:
        manifest = get_or_build_manifest("builtin-dpe", force=True)
        assert manifest["meta"]["row_count"] > 0
        names = {c["name"] for c in manifest["schema"]["columns"]}
        assert "etiquette_dpe" in names
        assert "code_postal_ban" in names
        print("   OK")
    except Exception as exc:
        errors.append(f"builtin-dpe: {exc}")

    print("2. Upload + analyze synthetic sales...")
    try:
        with tempfile.TemporaryDirectory() as tmp:
            csv_path = Path(tmp) / "ventes_sample.csv"
            _make_sales_csv(csv_path, 1000)
            df = pd.read_csv(csv_path)
            manifest = analyze_dataframe(df, dataset_id="test-upload", filename="ventes_sample.csv")
            assert manifest["meta"]["row_count"] == 1000
            assert len(manifest["schema"]["columns"]) >= 4
            sidebar = generate_sidebar(manifest)
            assert len(sidebar["filters"]) >= 3
            filt = filter_preview(df, {"produit": {"op": "in", "values": ["Widget A"]}})
            assert filt["filtered_row_count"] < 1000
            chart = build_chart_data(df, manifest)
            assert chart["data"]["categories"]
            print("   OK")
    except Exception as exc:
        errors.append(f"upload-analyze: {exc}")

    print("3. Dashboard regression file exists...")
    try:
        fin = ROOT / "data/services/data_processing/export_dashboard/table_financial.json"
        assert fin.exists()
        print("   OK")
    except Exception as exc:
        errors.append(f"regression: {exc}")

    if errors:
        print("FAILED:")
        for e in errors:
            print(" -", e)
        return 1
    print("All validation steps passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(run())
