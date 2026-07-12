import pandas as pd
import pytest
from django.test import Client

from data.services.acquisition.analyze_service import analyze_dataframe
from data.services.acquisition.dkm_context import audit_llm_context, dkm_planner_subset
from data.services.intelligence.chat_analyst import ask_data, build_llm_context


@pytest.mark.django_db
def test_chat_manifest_only_no_raw_rows(sales_df):
    manifest = analyze_dataframe(sales_df, dataset_id="chat-test", filename="sales.csv")
    context = build_llm_context(manifest, "Quel est le CA total ?")
    violations = audit_llm_context(context)
    assert violations == []
    assert "raw_rows" not in str(context)


@pytest.mark.django_db
def test_chat_revenue_answer(sales_df):
    manifest = analyze_dataframe(sales_df, dataset_id="chat-test", filename="sales.csv")
    result = ask_data(manifest, "Quel est le CA total ?")
    assert "CA total" in result["answer"] or "ca total" in result["answer"].lower()
    assert result["context_audit"] == []


@pytest.mark.django_db
def test_chat_api(sales_df):
    from data.dataset_store import datasets_root, save_manifest

    manifest = analyze_dataframe(sales_df, dataset_id="chat-api", filename="sales.csv")
    ds_dir = datasets_root() / "chat-api"
    ds_dir.mkdir(parents=True, exist_ok=True)
    sales_df.to_csv(ds_dir / "source.csv", index=False)
    save_manifest("chat-api", manifest)

    client = Client()
    response = client.post(
        "/api/datasets/chat-api/chat",
        data='{"message": "Combien de lignes ?"}',
        content_type="application/json",
    )
    assert response.status_code == 200
    body = response.json()
    assert "lignes" in body["answer"].lower()
    assert body["dialogue"]["chips"]


@pytest.mark.django_db
def test_dkm_planner_subset_excludes_sha256(sales_df):
    manifest = analyze_dataframe(sales_df, dataset_id="subset-test", filename="sales.csv")
    subset = dkm_planner_subset(manifest)
    assert "sha256" not in subset.get("meta", {})
