import io
import time

import pandas as pd
import pytest
from django.test import Client

from data.services.acquisition.analyze_service import analyze_dataframe


def _sales_csv(rows: int = 10000) -> bytes:
    import random
    from datetime import date, timedelta

    random.seed(99)
    data = []
    for i in range(rows):
        data.append(
            {
                "date_vente": (date(2024, 1, 1) + timedelta(days=i % 365)).isoformat(),
                "produit": random.choice(["Widget A", "Widget B", "Widget C", "Widget D"]),
                "montant": round(random.uniform(10, 500), 2),
                "region": random.choice(["Nord", "Sud", "Est", "Ouest"]),
            }
        )
    buf = io.StringIO()
    pd.DataFrame(data).to_csv(buf, index=False)
    return buf.getvalue().encode("utf-8")


@pytest.mark.django_db
def test_upload_analyze_sc_universal_schema():
    client = Client()
    file_obj = io.BytesIO(_sales_csv(10000))
    file_obj.name = "ventes_sample.csv"
    upload = client.post(
        "/api/datasets/upload",
        {"file": file_obj},
        format="multipart",
    )
    assert upload.status_code == 200
    dataset_id = upload.json()["dataset_id"]

    started = time.time()
    analyze = client.post(f"/api/datasets/{dataset_id}/analyze", content_type="application/json")
    elapsed = time.time() - started
    assert analyze.status_code == 200
    assert elapsed < 15

    manifest = analyze.json()["manifest"]
    assert manifest["meta"]["row_count"] == 10000
    assert len(manifest["schema"]["columns"]) >= 4
    types = {c["name"]: c["inferred_type"] for c in manifest["schema"]["columns"]}
    assert types["date_vente"] == "datetime"
    assert types["produit"] == "category"
    assert types["montant"] == "currency"
    assert manifest["insights"]["summary_fr"]


@pytest.mark.django_db
def test_analyze_dataframe_direct(sales_df):
    manifest = analyze_dataframe(sales_df, dataset_id="local-test", filename="sales.csv")
    assert manifest["meta"]["row_count"] == len(sales_df)
    assert len(manifest["schema"]["columns"]) == 4
