from pathlib import Path
import pandas as pd
from django.conf import settings

class DataCleaner:
    """
    Service responsable du chargement et du nettoyage initial des données.
    (Hérité de l'invention de Tayierjiang Tayier)
    """
    def __init__(self, data_source_dir=None):
        if data_source_dir is None:
            self.base_path = Path(settings.BASE_DIR) / "data" / "static" / "data_sources"
        else:
            self.base_path = Path(settings.BASE_DIR) / data_source_dir

    def load_renovation(self):
        """Charge et prépare renovation.csv"""
        csv_path = self.base_path / "renovation.csv"
        df = pd.read_csv(csv_path, sep=";", decimal=".")
        df = df.rename(
            columns={
                "Année de vote des travaux": "Annee",
                "Arrondissement": "Arrondissement",
                "Nombre de logts avec vote travaux": "Nb_logements",
            }
        )
        df["Annee"] = df["Annee"].astype(int)
        df["Arrondissement"] = df["Arrondissement"].astype(int)
        df["Nb_logements"] = df["Nb_logements"].astype(int)
        return df

    def load_dpe(self):
        """Charge dpe-75.csv"""
        csv_path = self.base_path / "dpe-75.csv"
        return pd.read_csv(csv_path, sep=";")

    def load_dpe_types(self):
        """Charge dpe-75(3).csv (ou dpe-75.csv si pas trouvé)"""
        csv_path = self.base_path / "dpe-75(3).csv"
        if csv_path.exists():
            return pd.read_csv(csv_path, sep=";")
        else:
            return self.load_dpe()

    def clean_dpe_energy(self, df):
        """Nettoie les données DPE pour les classes A-G"""
        return df[
            df["classe_consommation_energie"].isin(["A", "B", "C", "D", "E", "F", "G"])
        ]
