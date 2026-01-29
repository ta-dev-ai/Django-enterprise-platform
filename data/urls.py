from django.urls import path, re_path
from django.urls import register_converter
from . import views, views_test

urlpatterns = [
    # Routes Originales
    path("energy-classes/", views.get_energy_classes),
    path("Renovation-types/", views.get_Renovation_types),
    path("Batiment_renovates/", views.get_Batiment_renovates),
    # Nouvelle API Dashboard (JSON Pipeline)
    path("dashboard/<str:filename>/", views.api_dashboard_data),
    # Routes de TEST (pour l'intégration des fichiers JSON calculés)
    path("test/energy-classes/", views_test.get_test_energy_classes),
    path("test/Renovation-types/", views_test.get_test_renovation_types),
    path("test/Batiment_renovates/", views_test.get_test_batiment_renovates),
]
