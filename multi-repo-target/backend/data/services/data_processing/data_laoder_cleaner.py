import pandas as pd
from typing import List, Optional
from pathlib import Path

import os


class Data_loader:

    COLONNES_CRITIQUES = [
        "numero_dpe",
        "numero_rpls_logement",
        "numero_immatriculation_copropriete",
        "adresse_brut",
        "code_postal_ban",
        "date_etablissement_dpe",
        "date_fin_validite_dpe",
        "annee_construction",
        "etiquette_dpe",
        "etiquette_ges",
        "surface_habitable_logement",
        "conso_5_usages_par_m2_ep",
        "cout_total_5_usages",
        "qualite_isolation_murs",
        "qualite_isolation_menuiseries",
        "type_ventilation",
        "type_energie_principale_chauffage",
        "besoin_chauffage",
        "besoin_ecs",
        "type_batiment",
        "nombre_appartement",
    ]

    def __init__(
        self,
        output_dir="./data_light_output",
        columns_df_importent: Optional[List[str]] = None,
        file_name: str = None,
    ):
        os.makedirs(output_dir, exist_ok=True)
        self.output_dir = output_dir

        self.columns_df_importent = columns_df_importent
        self.df_light: pd.DataFrame = None
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.file_name = file_name
        self.output_path = f"{self.base_dir}{self.output_dir}/{file_name}_light.csv"

    def create_light_df_source(self) -> str:
        file_path = None
        if self.file_name is not None:
            file_path = self._get_file_path()
            if not file_path:
                print("file_name Se trouve pas dans le répertoire /data_source_inputs")
                return file_path

        self.df_light = self._load_clean_csv(file_path)

        if os.path.exists(self.output_path):
            print(f" Le fichier {self.file_name} existe")
            return self.output_path

        self.df_light.to_csv(self.output_path, index=False)
        print("output_path: ", self.output_path)
        return self.output_path

    # privet method
    def _get_file_path(self) -> Path:
        os.makedirs("./data_source_inputs", exist_ok=True)
        file_path = f"{self.base_dir}/data_source_inputs/dpe03existant_paris.csv"

        check_file_path = os.path.isfile(file_path)
        if check_file_path:
            return file_path
        return None

    def _load_clean_csv(self, file_path: str) -> pd.DataFrame:

        try:
            cols_data_load = (
                self.columns_df_importent
                if self.columns_df_importent is not None
                else self.COLONNES_CRITIQUES
            )
            df_brut = pd.read_csv(file_path, usecols=cols_data_load, low_memory=False)
            df_brut = df_brut.drop_duplicates(subset=["numero_dpe"])
            df_brut = df_brut.dropna(subset=["etiquette_dpe"])
            df_brut["code_postal_ban"] = df_brut["code_postal_ban"].astype("category")
            df_brut["numero_dpe"] = df_brut["numero_dpe"].astype("category")
            df_brut["etiquette_dpe"] = df_brut["etiquette_dpe"].astype("category")
            df_brut["etiquette_ges"] = df_brut["etiquette_ges"].astype("category")

            return df_brut

        except Exception as e:
            raise e
        else:
            print("pas de data ")


if __name__ == "__main__":
    d1 = Data_loader("./data_light_output")
    pathName = d1.create_light_df_source("dpe03existant_paris")
    print("pathName: ", pathName)
