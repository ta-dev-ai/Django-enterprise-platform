import json
import os
from django.http import JsonResponse
from django.conf import settings

# Chemin vers les fichiers JSON générés
EXPORT_DIR = os.path.join(
    settings.BASE_DIR, "data", "services", "data_processing", "export_dashboard"
)


def get_test_energy_classes(request):
    """Sert le fichier tableau_classes_dpe.json"""
    file_path = os.path.join(EXPORT_DIR, "tableau_classes_dpe.json")
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return JsonResponse(data, safe=False)


def get_test_renovation_types(request):
    """Sert le fichier tableau_types_travaux.json"""
    file_path = os.path.join(EXPORT_DIR, "tableau_types_travaux.json")
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return JsonResponse(data, safe=False)


def get_test_batiment_renovates(request):
    """Sert le fichier tableau_recherche.json"""
    file_path = os.path.join(EXPORT_DIR, "tableau_recherche.json")
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return JsonResponse(data, safe=False)
