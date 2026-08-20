"""Vues API REST de l'application data pour le dashboard de rénovation Paris."""

import json
import os

from django.conf import settings
from django.http import JsonResponse

try:
    from data.services.analyse_donnees_pandas import analyse_data_renovationParis

    analyse_service = analyse_data_renovationParis()
except ImportError:
    analyse_service = None


def get_energy_classes(request):
    """Retourne les classes énergétiques DPE pour les bâtiments rénovés."""
    if analyse_service is None:
        return JsonResponse({"error": "Service d'analyse non disponible (Pandas manquant)"}, status=503)
    raw_data = analyse_service.get_data_energy_classes()
    from data.dtos import Energy_classesDTO
    adapted_data = [{"className": item["class"], "count": item["count"]} for item in raw_data]
    dtos = [Energy_classesDTO.from_dict(item) for item in adapted_data]
    return JsonResponse([dto.__dict__ for dto in dtos], safe=False)


def get_Renovation_types(request):
    """Retourne les types de travaux de rénovation effectués."""
    if analyse_service is None:
        return JsonResponse({"error": "Service d'analyse non disponible (Pandas manquant)"}, status=503)
    from data.dtos import RenovationTypeDTO
    raw_data = analyse_service.get_data_Renovation_types()
    dtos = [RenovationTypeDTO.from_dict(item) for item in raw_data]
    return JsonResponse([dto.__dict__ for dto in dtos], safe=False)


def get_Batiment_renovates(request):
    """Retourne les données des bâtiments rénovés par arrondissement."""
    if analyse_service is None:
        return JsonResponse({"error": "Service d'analyse non disponible (Pandas manquant)"}, status=503)
    from data.dtos import Batiment_renovatedDTO
    raw_data = analyse_service.get_data_Batiment_renovates()
    adapted_data = [
        {
            "name": item["name"],
            "total": item["total"],
            "private_renovated": item["private_renovated"],
            "social_renovated": item["social_renovated"],
        }
        for item in raw_data
    ]
    dtos = [Batiment_renovatedDTO.from_dict(item) for item in adapted_data]
    return JsonResponse([dto.__dict__ for dto in dtos], safe=False)


def api_dashboard_data(request, filename):
    """Sert les fichiers JSON du dashboard (Tables Vertes et Jaunes).

    Route: /api/dashboard/<str:filename>/
    """
    if filename.endswith(".json"):
        filename = filename[:-5]

    allowed_files = [
        "table_market", "table_technical", "table_financial",
        "tableau_recherche", "tableau_types_travaux", "tableau_classes_dpe",
    ]

    if filename not in allowed_files:
        return JsonResponse({"error": "Fichier non autorisé"}, status=403)

    json_path = os.path.join(
        settings.BASE_DIR,
        "data", "services", "data_processing", "export_dashboard",
        f"{filename}.json",
    )

    if not os.path.exists(json_path):
        return JsonResponse({"error": f"Fichier introuvable: {filename}"}, status=404)

    try:
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return JsonResponse(data, safe=False)
    except Exception as e:  # noqa: BLE001
        return JsonResponse({"error": f"Erreur de lecture: {str(e)}"}, status=500)
