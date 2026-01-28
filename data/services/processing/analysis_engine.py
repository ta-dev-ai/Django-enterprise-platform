import pandas as pd

class AnalysisEngine:
    """
    Service responsable des calculs et de l'agrégation des données.
    (Hérité de l'invention de Tayierjiang Tayier)
    """
    def __init__(self, df_renovation=None, df_dpe=None, df_dpe_types=None):
        self.df_renovation = df_renovation
        self.df_dpe = df_dpe
        self.df_dpe_types = df_dpe_types

    def get_data_Batiment_renovates(self):
        df = self.df_renovation
        if df is None: return []

        agg = (
            df.groupby("Arrondissement")["Nb_logements"]
            .sum()
            .reset_index()
            .rename(columns={"Nb_logements": "renovated"})
        )

        agg["total"] = agg["renovated"]
        agg["private_renovated"] = 0
        agg["social_renovated"] = 0

        results = []
        for _, row in agg.iterrows():
            arr = int(row["Arrondissement"]) % 100
            name = "1er" if arr == 1 else f"{arr}e"

            results.append({
                "name": name,
                "total": int(row["total"]),
                "renovated": int(row["renovated"]),
                "private_renovated": int(row["private_renovated"]),
                "social_renovated": int(row["social_renovated"]),
            })
        return results

    def get_data_energy_classes(self, cleaner_ref=None):
        df = self.df_dpe
        if df is None: return []
        
        # Utilisation de la logique de nettoyage si fournie
        if cleaner_ref:
            df = cleaner_ref.clean_dpe_energy(df)

        stats_energie = (
            df.groupby("classe_consommation_energie")
            .size()
            .reset_index(name="count")
            .sort_values("classe_consommation_energie")
        )

        results = []
        for _, row in stats_energie.iterrows():
            results.append({
                "class": str(row["classe_consommation_energie"]),
                "count": int(row["count"]),
            })
        return results

    def get_data_Renovation_types(self):
        df = self.df_dpe_types
        if df is None: return []
        
        df = df.dropna(subset=["tr002_type_batiment_libelle"])
        stats_batiment = (
            df.groupby("tr002_type_batiment_libelle").size().reset_index(name="count")
        )

        total_global = stats_batiment["count"].sum()

        results = []
        for _, row in stats_batiment.iterrows():
            count = int(row["count"])
            percentage = round(count / total_global * 100, 2) if total_global > 0 else 0.0

            results.append({
                "type": str(row["tr002_type_batiment_libelle"]),
                "count": count,
                "percentage": percentage,
            })
        return results
