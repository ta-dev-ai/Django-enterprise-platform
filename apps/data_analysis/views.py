from django.shortcuts import render
import pandas as pd
import numpy as np
import json
import os
from django.conf import settings
from apps.data_analysis.services.processing.table_factory import TableFactory


def dashboard_view(request):
    """
    Vue de test qui utilise un DataFrame codé en dur (hardcoded)
    pour valider le front sans dépendre de fichiers CSV externes.
    """

    # 1. Données de Test (Hardcoded Data Source)
    data_test = {
        "numero_dpe": [
            "DPE001",
            "DPE002",
            "DPE003",
            "DPE004",
            "DPE005",
            "DPE006",
            "DPE007",
            "DPE008",
            "DPE009",
            "DPE010",
        ],
        "numero_rpls_logement": [
            np.nan,
            "RPLS-99",
            np.nan,
            np.nan,
            "RPLS-88",
            np.nan,
            np.nan,
            np.nan,
            "RPLS-77",
            np.nan,
        ],
        "numero_immatriculation_copropriete": [
            "COPRO-1",
            np.nan,
            "COPRO-2",
            np.nan,
            np.nan,
            "COPRO-3",
            np.nan,
            "COPRO-4",
            np.nan,
            np.nan,
        ],
        "adresse_brut": [
            "10 rue de Rivoli",
            "5 av Foch",
            "12 rue de la Paix",
            "3 bld Haussmann",
            "20 rue de Bercy",
            "8 rue du Bac",
            "1 av de Lyon",
            "90 rue de Paris",
            "45 rue du Commerce",
            "7 rue de Rennes",
        ],
        "code_postal_brut": [
            75001,
            75016,
            75001,
            75008,
            75012,
            75007,
            69000,
            75012,
            75015,
            75006,
        ],
        "date_etablissement_dpe": [
            "2023-01-10",
            "2022-05-15",
            "2023-08-20",
            "2021-12-01",
            "2023-03-12",
            "2022-11-30",
            "2023-01-05",
            "2023-06-25",
            "2022-09-10",
            "2023-02-28",
        ],
        "date_fin_validite_dpe": [
            "2033-01-10",
            "2032-05-15",
            "2033-08-20",
            "2031-12-01",
            "2033-03-12",
            "2032-11-30",
            "2033-01-05",
            "2033-06-25",
            "2032-09-10",
            "2033-02-28",
        ],
        "annee_construction": [
            1950,
            1970,
            1900,
            1985,
            2010,
            1960,
            1975,
            1955,
            2015,
            1930,
        ],
        "etiquette_dpe": ["G", "C", "A", "E", "B", "D", "F", "G", "A", "E"],
        "etiquette_ges": ["F", "B", "A", "D", "B", "C", "E", "F", "A", "D"],
        "surface_habitable_logement": [
            45.5,
            120.0,
            32.0,
            85.0,
            65.0,
            50.0,
            75.0,
            42.0,
            95.0,
            28.0,
        ],
        "conso_5_usages_par_m2_ef": [
            450.2,
            120.5,
            45.0,
            280.0,
            85.0,
            210.0,
            360.0,
            480.0,
            40.0,
            310.0,
        ],
        "cout_total_5_usages": [
            2500,
            1500,
            400,
            2000,
            800,
            1200,
            1900,
            2800,
            500,
            1100,
        ],
        "qualite_isolation_murs": [
            "insuffisante",
            "bonne",
            "très bonne",
            "moyenne",
            "très bonne",
            "moyenne",
            "insuffisante",
            "insuffisante",
            "très bonne",
            "moyenne",
        ],
        "qualite_isolation_menuiseries": [
            "moyenne",
            "bonne",
            "très bonne",
            "moyenne",
            "bonne",
            "moyenne",
            "insuffisante",
            "moyenne",
            "très bonne",
            "insuffisante",
        ],
        "type_ventilation": [
            "Naturelle",
            "VMC simple",
            "VMC double",
            "VMC simple",
            "VMC double",
            "Naturelle",
            "Naturelle",
            "VMC simple",
            "VMC double",
            "Naturelle",
        ],
        "type_energie_principale_chauffage": [
            "Fioul",
            "Gaz",
            "Électricité",
            "Gaz",
            "Électricité",
            "Gaz",
            "Fioul",
            "Électricité",
            "Électricité",
            "Gaz",
        ],
        "besoin_chauffage": [
            15000,
            8000,
            2000,
            10000,
            3500,
            7000,
            12000,
            14000,
            2500,
            6000,
        ],
        "besoin_ecs": [2500, 3000, 1500, 2800, 2000, 2200, 2600, 2400, 1800, 1600],
        "type_batiment": [
            "appartement",
            "maison",
            "appartement",
            "appartement",
            "appartement",
            "appartement",
            "maison",
            "appartement",
            "appartement",
            "appartement",
        ],
        "nombre_appartement": [12, 1, 8, 20, 50, 15, 1, 10, 40, 6],
    }

    # Création du DataFrame
    df = pd.DataFrame(data_test)

    # 2. Ajout des colonnes calculées manquantes (pour simuler la logique de data_make_new_df_DPE.py)
    # Dans la config, il y a 'statut_juridique', 'pourcentage_renover_prive', 'pourcentage_renover_social'
    # On va les mocker simplement ici car le but est de tester l'affichage.

    df["statut_juridique"] = df["numero_immatriculation_copropriete"].apply(
        lambda x: "Copro" if pd.notnull(x) else "Monopropriété"
    )
    # Simulation de pourcentage pour l'affichage (valeurs bidons)
    df["pourcentage_renover_prive"] = np.random.randint(0, 100, size=len(df))
    df["pourcentage_renover_social"] = np.random.randint(0, 100, size=len(df))

    # 3. Chargement de la Config JSON
    base_dir = settings.BASE_DIR
    config_path = os.path.join(
        base_dir,
        "data",
        "services",
        "data_processing",
        "data_config",
        "config_data_DPE.json",
    )

    # 4. Utilisation de la Factory pour générer les tables
    factory = TableFactory(df, config_path)
    factory.generate_all()

    # 5. Préparation des données pour le template
    # On passe le mapping des noms
    table_names_map = factory.get_table_names_map()

    # On passe AUSSI les données JSON directement dans le template pour l'instant
    # (pour éviter un appel API supplémentaire et simplifier le debug)
    json_payload = factory.get_json_payload()

    context = {
        "dashboard_tables": table_names_map,
        "initial_data_json": json.dumps(json_payload),  # Données injectées en JS
    }

    return render(request, "pages/dashboard/dashboard.html", context)
