import pytest

@pytest.fixture
def dpe_fixture_path():
    from pathlib import Path
    from django.conf import settings
    return (
        Path(settings.BASE_DIR)
        / "data"
        / "services"
        / "acquisition"
        / "fixtures"
        / "dpe_builtin_sample.csv"
    )

@pytest.fixture
def sales_df():
    import random
    from datetime import date, timedelta
    import pandas as pd

    random.seed(1)
    rows = []
    for i in range(200):
        rows.append(
            {
                "date_vente": (date(2024, 1, 1) + timedelta(days=i % 100)).isoformat(),
                "produit": ["Widget A", "Widget B", "Widget C"][i % 3],
                "montant": round(50 + i * 1.5, 2),
                "region": ["Nord", "Sud", "Est"][i % 3],
            }
        )
    return pd.DataFrame(rows)
