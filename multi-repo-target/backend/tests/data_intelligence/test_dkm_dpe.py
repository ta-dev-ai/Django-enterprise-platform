import pandas as pd
import pytest
from django.test import Client

from data.services.acquisition.analyze_service import analyze_dataframe, get_or_build_manifest


@pytest.mark.django_db
def test_dkm_dpe_valid(dpe_fixture_path):
    df = pd.read_csv(dpe_fixture_path)
    manifest = analyze_dataframe(
        df,
        dataset_id="builtin-dpe",
        filename="dpe_builtin_sample.csv",
        source="builtin_dpe",
        domain_hint="renovation_dpe",
    )
    assert manifest["dkm_version"] == "1.0"
    assert manifest["meta"]["row_count"] > 0
    names = {c["name"] for c in manifest["schema"]["columns"]}
    assert "etiquette_dpe" in names
    assert "code_postal_ban" in names
    assert manifest["insights"]["detected_domain"] == "renovation_dpe"
    assert manifest["insights"]["summary_fr"]


@pytest.mark.django_db
def test_get_knowledge_api_builtin_dpe(dpe_fixture_path):
    client = Client()
    response = client.get("/api/datasets/builtin-dpe/knowledge")
    assert response.status_code == 200
    payload = response.json()
    assert "manifest" in payload
    assert payload["manifest"]["meta"]["row_count"] > 0


@pytest.mark.django_db
def test_dpe_paris_alias():
    client = Client()
    response = client.get("/api/datasets/dpe_paris/knowledge")
    assert response.status_code == 200
    assert response.json()["manifest"]["insights"]["detected_domain"] == "renovation_dpe"
