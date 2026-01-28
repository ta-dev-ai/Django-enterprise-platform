import pandas as pd
import json
import os
import logging

logger = logging.getLogger(__name__)

class TableFactory:
    """
    Service responsable de la découpe du DataFrame en tables spécifiques pour le Frontend.
    Migré depuis table_factory.py
    """
    
    def __init__(self, df: pd.DataFrame, config_path: str):
        self.df = df
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                self.config = json.load(f)
        except FileNotFoundError:
            logger.error(f"Fichier de configuration introuvable : {config_path}")
            self.config = {}
            
        self.generated_tables = {}

    def generate_all(self):
        """Génère toutes les tables définies dans la configuration."""
        for table_name, columns in self.config.items():
            # Vérifier que toutes les colonnes existent dans le DF
            valid_cols = [c for c in columns if c in self.df.columns]
            
            if len(valid_cols) < len(columns):
                missing = set(columns) - set(valid_cols)
                logger.warning(f"Table {table_name}: Colonnes manquantes ignorées -> {missing}")

            if valid_cols:
                self.generated_tables[table_name] = self.df[valid_cols].copy()
            else:
                self.generated_tables[table_name] = pd.DataFrame() # Table vide

    def get_json_payload(self) -> dict:
        """Retourne un dictionnaire prêt pour l'API JSON."""
        payload = {}
        for name, df in self.generated_tables.items():
            # Conversion en liste de dictionnaires (records)
            # ex: [{'col1': val1, 'col2': val2}, ...]
            payload[name] = df.to_dict(orient="records")
        return payload

    def get_table_names_map(self) -> dict:
        """Retourne un mapping {cle_technique: Nom Affichage} pour le dashboard."""
        # Pour cet exemple simple, on formate juste le nom technique.
        # Idéalement, cela viendrait aussi du JSON de config.
        mapping = {}
        for key in self.config.keys():
            # table_market_obsolescence -> Market Obsolescence
            clean_name = key.replace('table_', '').replace('_', ' ').title()
            mapping[key] = clean_name
        return mapping
