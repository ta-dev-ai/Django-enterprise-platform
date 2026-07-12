"""MCP-style tools for Data Intelligence."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Optional

from data.dataset_store import load_manifest, save_manifest, source_path
from data.services.acquisition.analyze_service import analyze_dataframe, get_or_build_manifest
from data.services.acquisition.dataset_loader import load_dataframe
from data.services.intelligence.chat_analyst import ask_data
from data.services.runtime.chart_engine import build_chart_data
from data.services.runtime.filter_engine import filter_preview


def analyze_dataset(path: str, domain_hint: Optional[str] = None) -> dict[str, Any]:
    p = Path(path)
    df = load_dataframe(p)
    dataset_id = p.stem
    return analyze_dataframe(
        df,
        dataset_id=dataset_id,
        filename=p.name,
        fmt=p.suffix.lstrip("."),
        source="mcp",
        domain_hint=domain_hint,
    )


def get_knowledge(dataset_id: str) -> dict[str, Any]:
    manifest = load_manifest(dataset_id) or get_or_build_manifest(dataset_id)
    return {
        "manifest": manifest,
        "slices_count": len(manifest.get("engines_trace", [])),
    }


def ask_data_tool(dataset_id: str, question: str) -> dict[str, Any]:
    manifest = load_manifest(dataset_id) or get_or_build_manifest(dataset_id)
    return ask_data(manifest, question)


def export_report(dataset_id: str, fmt: str = "html") -> dict[str, Any]:
    manifest = load_manifest(dataset_id) or get_or_build_manifest(dataset_id)
    insights = manifest.get("insights", {})
    quality = manifest.get("quality", {})
    meta = manifest.get("meta", {})
    html = f"""<!DOCTYPE html><html><head><meta charset='utf-8'><title>Rapport {dataset_id}</title></head>
<body><h1>Rapport Data Intelligence</h1>
<p><strong>Dataset:</strong> {meta.get('filename', dataset_id)}</p>
<p><strong>Lignes:</strong> {meta.get('row_count', 0)}</p>
<p><strong>Résumé:</strong> {insights.get('summary_fr', '')}</p>
<p><strong>Confiance:</strong> {quality.get('confidence', 0)}</p>
</body></html>"""
    out_dir = Path("data/datasets") / dataset_id
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"report.{fmt}"
    out_path.write_text(html, encoding="utf-8")
    return {"path": str(out_path), "format": fmt}
