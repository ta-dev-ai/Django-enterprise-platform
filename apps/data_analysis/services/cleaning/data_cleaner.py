import pandas as pd
from typing import List, Optional
from pathlib import Path
import os
import logging

logger = logging.getLogger(__name__)

class DataCleaner:
    """
    Service responsable du nettoyage et de la standardisation des données.
    Migré depuis data_laoder_cleaner.py
    """

    COLONNES_CRITIQUES = [
        "numero_dpe",
        "numero_rpls_logement",
        "numero_immatriculation_copropriete",
        "adresse_brut",
        "code_postal_brut",
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

    def __init__(self, columns_to_keep: Optional[List[str]] = None):
        self.columns_to_keep = columns_to_keep or self.COLONNES_CRITIQUES

    def load_and_clean(self, file_path: str) -> pd.DataFrame:
        """
        Charge un CSV, garde les colonnes utiles, supprime les doublons et filtre les données invalides.
        """
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"Le fichier n'existe pas : {file_path}")

            logger.info(f"Chargement du fichier : {file_path}")
            
            # Chargement optimisé
            df = pd.read_csv(file_path, usecols=lambda c: c in self.columns_to_keep, low_memory=False)
            
            # Nettoyage
            initial_count = len(df)
            df = df.drop_duplicates(subset=["numero_dpe"])
            df = df.dropna(subset=["etiquette_dpe"])
            
            # Typage
            if "code_postal_brut" in df.columns:
                df["code_postal_brut"] = df["code_postal_brut"].astype("category")
            if "numero_dpe" in df.columns:
                df["numero_dpe"] = df["numero_dpe"].astype("category")
            
            final_count = len(df)
            logger.info(f"Nettoyage terminé. Lignes: {initial_count} -> {final_count}")

            return df

        except Exception as e:
            logger.error(f"Erreur lors du nettoyage : {str(e)}")
            raise e
