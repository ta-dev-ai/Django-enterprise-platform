import json

import pytest
from django.test import Client


@pytest.mark.django_db
def test_dashboard_api_table_financial_200():
    client = Client()
    response = client.get("/api/dashboard/table_financial/")
    assert response.status_code == 200
    data = response.json()
    assert "meta" in data
    assert "data" in data


@pytest.mark.django_db
def test_dashboard_allowed_files():
    client = Client()
    for name in [
        "table_market",
        "table_technical",
        "table_financial",
        "tableau_recherche",
        "tableau_types_travaux",
        "tableau_classes_dpe",
    ]:
        response = client.get(f"/api/dashboard/{name}/")
        assert response.status_code == 200, name


@pytest.mark.django_db
def test_dashboard_forbidden_file():
    client = Client()
    response = client.get("/api/dashboard/secret/")
    assert response.status_code == 403
