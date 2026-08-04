"""Generate sidebar filter spec from DKM."""

from __future__ import annotations

import re
from typing import Any


ROLE_ORDER = {"dimension": 0, "time_dimension": 1, "measure": 2, "identifier": 3}


def generate_sidebar(manifest: dict[str, Any]) -> dict[str, Any]:
    filters = []
    for col in manifest.get("schema", {}).get("columns", []):
        if col.get("null_rate", 0) > 0.95:
            continue
        widget = col.get("filter_widget")
        if not widget:
            continue
        entry: dict[str, Any] = {
            "column": col["name"],
            "label_fr": _label_fr(col["name"]),
            "widget": widget,
            "default": None,
        }
        if widget in ("multi_select", "chips", "search_select") and col.get("top_values"):
            entry["options"] = col["top_values"]
        if widget == "date_range" and col.get("stats"):
            entry["bounds"] = col["stats"]
        if widget == "numeric_range" and col.get("stats"):
            entry["bounds"] = col["stats"]
        filters.append(entry)

    filters.sort(
        key=lambda f: (
            ROLE_ORDER.get(
                _role(manifest, f["column"]),
                9,
            ),
            f["label_fr"],
        )
    )
    return {"filters": filters}


def _role(manifest: dict, column: str) -> str:
    for col in manifest.get("schema", {}).get("columns", []):
        if col["name"] == column:
            return col.get("semantic_role") or "dimension"
    return "dimension"


def _label_fr(name: str) -> str:
    overrides = {
        "code_postal_ban": "Code postal",
        "etiquette_dpe": "Étiquette DPE",
        "cout_total_5_usages": "Coût énergie annuel",
        "surface_habitable_logement": "Surface habitable",
        "date_vente": "Date vente",
        "produit": "Produit",
        "montant": "Montant",
        "region": "Région",
    }
    if name in overrides:
        return overrides[name]
    return re.sub(r"_+", " ", name).strip().title()
