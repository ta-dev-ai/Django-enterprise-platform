import pandas as pd
import pytest
from django.test import Client

from data.services.acquisition.analyze_service import analyze_dataframe
from data.services.runtime.filter_engine import filter_preview
from data.services.runtime.sidebar_generator import generate_sidebar


def _manifest_from_df(df, dataset_id="sb-test"):
    return analyze_dataframe(df, dataset_id=dataset_id, filename="test.csv")


@pytest.mark.django_db
def test_sb01_five_columns_five_widgets():
    df = pd.DataFrame(
        {
            "a_cat": ["x", "y", "z"],
            "b_num": [1, 2, 3],
            "c_date": ["2024-01-01", "2024-02-01", "2024-03-01"],
            "d_text": ["hello world long text"] * 3,
            "e_bool": [True, False, True],
        }
    )
    manifest = _manifest_from_df(df)
    sidebar = generate_sidebar(manifest)
    assert len(sidebar["filters"]) == 5


@pytest.mark.django_db
def test_sb02_category_three_values():
    df = pd.DataFrame({"produit": ["A", "B", "C"] * 10})
    manifest = _manifest_from_df(df)
    sidebar = generate_sidebar(manifest)
    filt = next(f for f in sidebar["filters"] if f["column"] == "produit")
    assert filt["widget"] == "multi_select"
    assert len(filt["options"]) == 3


@pytest.mark.django_db
def test_sb03_date_between_reduces_rows():
    df = pd.DataFrame(
        {
            "date_vente": ["2024-01-01", "2024-06-01", "2024-12-01"] * 20,
            "montant": list(range(60)),
        }
    )
    manifest = _manifest_from_df(df)
    result = filter_preview(
        df,
        {
            "date_vente": {
                "op": "between",
                "min": "2024-01-01",
                "max": "2024-03-31",
            }
        },
    )
    assert result["filtered_row_count"] < result["total_row_count"]


@pytest.mark.django_db
def test_sb04_all_null_column_excluded():
    df = pd.DataFrame({"good": [1, 2, 3], "empty": [None, None, None]})
    manifest = _manifest_from_df(df)
    sidebar = generate_sidebar(manifest)
    cols = [f["column"] for f in sidebar["filters"]]
    assert "empty" not in cols


@pytest.mark.django_db
def test_sb05_dpe_etiquette_chips(dpe_fixture_path):
    df = pd.read_csv(dpe_fixture_path)
    manifest = analyze_dataframe(
        df,
        dataset_id="builtin-dpe",
        domain_hint="renovation_dpe",
    )
    sidebar = generate_sidebar(manifest)
    etiq = next(f for f in sidebar["filters"] if f["column"] == "etiquette_dpe")
    assert etiq["widget"] == "chips"
    values = {o["value"] for o in etiq["options"]}
    assert values.issubset(set("ABCDEFG"))
