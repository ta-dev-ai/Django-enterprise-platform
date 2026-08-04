import pandas as pd
import pytest
from django.test import Client

from data.services.acquisition.analyze_service import analyze_dataframe
from data.services.acquisition.dkm_context import audit_llm_context, dkm_planner_subset
from data.services.intelligence.chat_analyst import ask_data, build_llm_context
from data.services.runtime.chart_engine import build_chart_data


@pytest.mark.django_db
def test_chart_bar_data(sales_df):
    manifest = analyze_dataframe(sales_df, dataset_id="chart-test", filename="sales.csv")
    result = build_chart_data(sales_df, manifest)
    assert result["data"]["categories"]
    assert result["data"]["series"]


@pytest.mark.django_db
def test_chart_api(sales_df, tmp_path):
    from data.dataset_store import save_manifest, datasets_root
    import json

    manifest = analyze_dataframe(sales_df, dataset_id="chart-api", filename="sales.csv")
    ds_dir = datasets_root() / "chart-api"
    ds_dir.mkdir(parents=True, exist_ok=True)
    sales_df.to_csv(ds_dir / "source.csv", index=False)
    save_manifest("chart-api", manifest)

    client = Client()
    response = client.post(
        "/api/datasets/chart-api/chart",
        data='{"chart_spec": null}',
        content_type="application/json",
    )
    assert response.status_code == 200
    assert response.json()["data"]["categories"]
