import pandas as pd
import json
import os
from pathlib import Path

class TableFactory:
    def __init__(self, df, config_ia):
        self.df = df
        self.config_ia = config_ia
        self.generated_tables = {}

    def should_run_pipeline(self, output_dir):
        """
        Vérifie si les 6 fichiers attendus existent déjà.
        Si oui, on renvoie False pour ne pas régénérer.
        """
        expected_files = [
            "table_market.json", "table_technical.json", "table_financial.json",
            "tableau_recherche.json", "tableau_types_travaux.json", "tableau_classes_dpe.json"
        ]
        
        # Si le dossier n'existe même pas, on doit rouler le pipeline
        if not os.path.exists(output_dir):
            return True
            
        # On vérifie si un seul fichier manque
        for file_name in expected_files:
            if not os.path.exists(os.path.join(output_dir, file_name)):
                return True # Il manque un fichier, on génère
                
        return False # Tout est là, on ne fait rien

    # ==========================================
    # 1. PARTIE AUTOMATIQUE (3 Tables Brutes)
    # ==========================================
    def _create_raw_table(self, table_name):
        cols = self.config_ia.get(table_name, [])
        valid_cols = [c for c in cols if c in self.df.columns]
        return self.df[valid_cols].to_dict(orient="records")

    def generate_raw_tables(self):
        for table_name in self.config_ia.keys():
            self.generated_tables[table_name] = self._create_raw_table(table_name)

    # ==========================================
    # 2. PARTIE CALCULÉE (Correction Fusion Privée)
    # ==========================================
    def _format_to_yearly_dict(self, df):
        final_dict = {}
        for annee, group in df.groupby("annee"):
            final_dict[str(int(annee))] = group.drop(columns="annee").to_dict(orient="records")
        return final_dict

    def generate_tableau_recherche(self):
        """Fusionne Privé (Copro) et Privé (Individuel) en 'logements_prives'"""
        # On crée une colonne temporaire pour la fusion
        df_temp = self.df.copy()
        df_temp['statut_simple'] = df_temp['statut_juridique'].apply(
            lambda x: 'logements_prives' if 'Privé' in str(x) else 'logements_sociaux'
        )

        grouped = df_temp.groupby(["annee", "arrondissement", "statut_simple"]).agg(
            total=("numero_dpe", "count"),
            renovated=("is_renovated", "sum")
        ).unstack(fill_value=0)

        # Mise à plat des colonnes pour correspondre à ton format exact
        pivot_df = pd.DataFrame()
        pivot_df['annee'] = grouped.index.get_level_values('annee')
        pivot_df['arrondissement'] = grouped.index.get_level_values('arrondissement')
        
        # Assignation des valeurs fusionnées
        pivot_df['logements_prives'] = grouped[('total', 'logements_prives')].values
        pivot_df['logements_sociaux'] = grouped[('total', 'logements_sociaux')].values
        pivot_df['logements_prives_renoves'] = grouped[('renovated', 'logements_prives')].values
        pivot_df['logements_sociaux_renoves'] = grouped[('renovated', 'logements_sociaux')].values
        pivot_df['total_logements_renoves'] = pivot_df['logements_prives_renoves'] + pivot_df['logements_sociaux_renoves']

        self.generated_tables["tableau_recherche"] = self._format_to_yearly_dict(pivot_df)

    def generate_tableau_types_renovation(self):
        df_reno = self.df[self.df["is_renovated"] == 1].copy()
        types_travaux = {
            "Isolation": "qualite_isolation_murs",
            "Menuiseries": "qualite_isolation_menuiseries",
            "Chauffage": "type_energie_principale_chauffage",
            "Ventilation": "type_ventilation",
        }
        final_dict = {}
        for annee in sorted(df_reno["annee"].unique(), reverse=True):
            annee_str = str(int(annee))
            final_dict[annee_str] = {}
            df_year = df_reno[df_reno["annee"] == annee]
            for label, col_name in types_travaux.items():
                group = df_year.groupby(["arrondissement", "statut_juridique"]).size().reset_index(name='total_logements')
                final_dict[annee_str][label] = group.to_dict(orient="records")
        self.generated_tables["tableau_types_travaux"] = final_dict

    def generate_tableau_classes_dpe(self):
        grouped = self.df.groupby(["annee", "etiquette_dpe"]).agg(
            total=("numero_dpe", "count"),
            renoves=("is_renovated", "sum")
        ).reset_index()

        final_dict = {}
        for annee, group in grouped.groupby("annee"):
            final_dict[str(int(annee))] = [
                {"classe": r["etiquette_dpe"], "total": int(r["total"]), "renoves": int(r["renoves"])}
                for _, r in group.iterrows()
            ]
        self.generated_tables["tableau_classes_dpe"] = final_dict

    # ==========================================
    # 3. EXPORT & RUN
    # ==========================================
    def run_pipeline(self):
        print("⚙️ Fabrication des tables en cours...")
        self.generate_raw_tables()
        self.generate_tableau_recherche()
        self.generate_tableau_types_renovation()
        self.generate_tableau_classes_dpe()
        return self.generated_tables

    def export_to_json(self, output_dir):
        os.makedirs(output_dir, exist_ok=True)
        for name, data in self.generated_tables.items():
            path = os.path.join(output_dir, f"{name}.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✨ Exportation terminée dans {output_dir}")