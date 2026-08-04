from django.urls import path, re_path
from django.urls import register_converter
from . import views, views_test, views_datasets

urlpatterns = [
    # Routes Originales
    path("energy-classes/", views.get_energy_classes),
    path("Renovation-types/", views.get_Renovation_types),
    path("Batiment_renovates/", views.get_Batiment_renovates),
    # Nouvelle API Dashboard (JSON Pipeline)
    path(
        "dashboard/<str:filename>/", views.api_dashboard_data, name="api-dashboard-data"
    ),
    # Data Intelligence V2
    path("datasets/upload", views_datasets.api_dataset_upload, name="api-dataset-upload"),
    path(
        "datasets/<str:dataset_id>/analyze",
        views_datasets.api_dataset_analyze,
        name="api-dataset-analyze",
    ),
    path(
        "datasets/<str:dataset_id>/knowledge",
        views_datasets.api_dataset_knowledge,
        name="api-dataset-knowledge",
    ),
    path(
        "datasets/<str:dataset_id>/sidebar",
        views_datasets.api_dataset_sidebar,
        name="api-dataset-sidebar",
    ),
    path(
        "datasets/<str:dataset_id>/filter",
        views_datasets.api_dataset_filter,
        name="api-dataset-filter",
    ),
    path(
        "datasets/<str:dataset_id>/chart",
        views_datasets.api_dataset_chart,
        name="api-dataset-chart",
    ),
    path(
        "datasets/<str:dataset_id>/chat",
        views_datasets.api_dataset_chat,
        name="api-dataset-chat",
    ),
    # Routes de TEST (pour l'intégration des fichiers JSON calculés)
    path("test/energy-classes/", views_test.get_test_energy_classes),
    path("test/Renovation-types/", views_test.get_test_renovation_types),
    path("test/Batiment_renovates/", views_test.get_test_batiment_renovates),
]
