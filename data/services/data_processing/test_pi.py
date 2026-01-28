from data_laoder_cleaner import Data_loader
from data_make_new_df_DPE import Make_new_df
from table_factory import TableFactory
import os
from pathlib import Path


def start_pipeline_DPE():
    # 1. Définir le chemin d'export
    export_path = Path(
        r"C:\Users\ntpar\Documents\Démarche\Tayier\formation_python_2025\projet renovationEnergitque\batiment-renovation-paris-main_tayier\batiment-renovation-paris-monta\data\services\data_processing\export_dashboard"
    )

    # 2. Vérifier si les 3 fichiers existent déjà
    files_to_check = [
        export_path / "tableau_recherche.json",
        export_path / "tableau_types_travaux.json",
        export_path / "tableau_classes_dpe.json",
    ]

    # Si TOUS les fichiers existent, on arrête tout de suite
    if all(f.exists() for f in files_to_check):
        print("✅ Les fichiers JSON existent déjà. Pipeline ignoré.")
        return  # On sort de la fonction sans rien exécuter

    # 3. Si un fichier manque, on exécute tout le chargement et calcul
    print("🚀 Fichiers manquants ou mise à jour nécessaire. Lancement du pipeline...")

    data_loader = Data_loader(file_name="dpe03existant_paris")
    data_loader.create_light_df_source()

    make_new_df = Make_new_df()
    df_light = make_new_df.get_new_df()

    # Initialisation de la Factory avec les données
    factory = TableFactory(df_light)

    # Génération des 3 tables (avec les nouvelles structures Privé/Social)
    factory.generate_tableau_recherche()  # Table 1
    factory.generate_tableau_types_renovation()  # Table 2
    factory.generate_tableau_classes_dpe()  # Table 3

    # Exportation finale
    factory.export_to_json(str(export_path))
    print("✨ Pipeline terminé avec succès !")


if __name__ == "__main__":
    start_pipeline_DPE()
