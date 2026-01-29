import json
import os
from pathlib import Path
from data_laoder_cleaner import Data_loader
from data_make_new_df_DPE import Make_new_df
from table_factory import TableFactory


def start_pipeline_DPE():
    # 1. ON TROUVE LA RACINE (Dossier 'batiment-renovation-paris-monta - Copie')
    # On remonte depuis ce fichier jusqu'à trouver le dossier qui contient 'data'
    current_dir = Path(__file__).resolve().parent
    base_path = current_dir
    while base_path.name and not (base_path / "data").exists():
        base_path = base_path.parent

    # --- VERIFICATION DES CHEMINS ---
    # Ici on construit les chemins SANS doubler le mot 'data'
    config_ia_path = (
        base_path
        / "data"
        / "services"
        / "data_processing"
        / "data_config"
        / "config_data_DPE.json"
    )
    export_path = (
        base_path / "data" / "services" / "data_processing" / "export_dashboard"
    )

    print(f"🏠 Racine du projet : {base_path}")
    print(f"🔍 Recherche config à : {config_ia_path}")

    # 2. Vérifier si la config existe avant de continuer
    if not config_ia_path.exists():
        print(
            f"❌ ERREUR : Le fichier de config est INTROUVABLE ici : {config_ia_path}"
        )
        print(
            "Vérifie que le dossier 'data_config' contient bien 'config_data_DPE.json'"
        )
        return

    # 3. Vérifier si les fichiers de sortie existent déjà (Optionnel)
    files_to_check = [
        "tableau_recherche",
        "tableau_types_travaux",
        "tableau_classes_dpe",
        "table_market",
        "table_technical",
        "table_financial",
    ]

    if all((export_path / f"{name}.json").exists() for name in files_to_check):
        print("✅ Tous les fichiers JSON existent déjà. Fin du pipeline.")
        return

    # 4. Chargement de la config
    with open(config_ia_path, "r", encoding="utf-8") as f:
        config_ia = json.load(f)

    # 5. Pipeline de données
    print("🚀 Lancement du pipeline de données...")

    # Note: Assure-toi que Data_loader n'a pas aussi des chemins en dur 'C:\...'
    data_loader = Data_loader(file_name="dpe03existant_paris")
    data_loader.create_light_df_source()

    make_new_df = Make_new_df()
    df_light = make_new_df.get_new_df()

    # 6. Factory et Génération
    factory = TableFactory(df_light, config_ia)
    factory.run_pipeline()

    # 7. Export
    factory.export_to_json(str(export_path))
    print(f"✨ Succès ! Tables exportées dans : {export_path}")


if __name__ == "__main__":
    start_pipeline_DPE()
