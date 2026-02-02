import pandas as pd
import numpy as np
import os


class Make_new_df:

    def __init__(self, file_path=None):
        if file_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            self.file_path = os.path.join(
                base_dir, "data_light_output", "dpe03existant_paris_light.csv"
            )
        else:
            self.file_path = file_path

    # Sauvegarde en CSV pour simuler le fichier réel

    def _load_light_csv(self, filter_paris=True):
        is_ok = os.path.isfile(self.file_path)
        df_source = pd.read_csv(self.file_path, low_memory=False)
        if filter_paris:

            conditions_series = (
                df_source["code_postal_ban"].astype(str).str.startswith("75")
            )

            df_source = df_source[conditions_series]
            df_source["code_postal_ban"] = (
                df_source["code_postal_ban"].astype(str).str.zfill(5)
            )
            # On garde 'code_postal_ban' car il est attendu dans la config
            # On crée 'code_postal_clean' comme alias interne
            df_source["code_postal_clean"] = df_source["code_postal_ban"]

            df_source["arrondissement"] = (
                df_source["code_postal_clean"].str[-2:].astype(int)
            )

            df_source = df_source[df_source["arrondissement"].between(1, 20)]

            df_source["logement"] = df_source["numero_dpe"].notna().astype(int)

        self.df_light = df_source

    def _add_new_columns(self):
        self.df_light["statut_juridique"] = "Privé (Individuel)"

        condition_sociale = self.df_light["numero_rpls_logement"].notna()

        condition_privet_copro = self.df_light[
            "numero_immatriculation_copropriete"
        ].notna()

        self.df_light.loc[condition_sociale, "statut_juridique"] = "Social"

        self.df_light.loc[condition_privet_copro, "statut_juridique"] = "Privé (Copro)"

        self.df_light["is_renovated"] = (
            self.df_light["etiquette_dpe"].isin(["A", "B", "C", "D"]).astype(int)
        )
        self.df_light["arrondissement"] = (
            self.df_light["code_postal_clean"].str[-2:].astype(int)
        )

        self.df_light = self.df_light[self.df_light["arrondissement"].between(1, 20)]

        self.df_light["logement"] = self.df_light["numero_dpe"].notna().astype(int)

        # 1. Convertir en format datetime
        self.df_light["date_etablissement_dpe"] = pd.to_datetime(
            self.df_light["date_etablissement_dpe"]
        )

        # 3. Créer la colonne année
        self.df_light["annee"] = self.df_light["date_etablissement_dpe"].dt.year

    def _add_computed_columns(self):
        renovation_by_postal_and_status = self.df_light.groupby(
            ["code_postal_ban", "statut_juridique"]
        )

        renovation_by_postal_and_status_df = (
            renovation_by_postal_and_status["is_renovated"].mean() * 100
        )

        renovation_pivot = renovation_by_postal_and_status_df.unstack(
            fill_value=0
        ).round(2)

        renovation_by_postal_and_status_df = renovation_by_postal_and_status[
            "total_logements"
        ].sum()

        for column in renovation_pivot.columns:
            if column == "Social":
                self.df_light["pourcentage_renover_social"] = self.df_light[
                    "code_postal_ban"
                ].map(renovation_pivot["Social"])
            elif column == "Privé (Copro)":
                self.df_light["pourcentage_renover_privet_copro"] = self.df_light[
                    "code_postal_ban"
                ].map(renovation_pivot["Privé (Copro)"])

            self.df_light["pourcentage_renover_privet_individuel"] = self.df_light[
                "code_postal_ban"
            ].map(renovation_pivot["Privé (Individuel)"])

            self.df_light.drop(columns="is_renovated")

    def get_new_df(self) -> pd.DataFrame:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        output_path = os.path.join(
            base_dir, "data_light_output", "new_dpe03existant_paris_light.csv"
        )

        if not os.path.exists(output_path):
            self._load_light_csv()
            self._add_new_columns()
            # self._add_computed_columns()

            self.df_light.to_csv(output_path, index=False)

            return self.df_light

        df_new_source = pd.read_csv(output_path, low_memory=False)

        return df_new_source
