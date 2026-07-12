import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    # --- MAIN SITE (PREMIUM SPA) ---
    path("", views.index, name="home"),
    path("about/", views.about, name="about"),
    path("cv/", views.cv, name="cv"),
    path("contact/", views.contact, name="contact"),
    path("mentions-legales/", views.legal_mentions, name="legal-mentions"),
    path("confidentialite/", views.legal_privacy, name="legal-privacy"),
    path("impressum/", views.legal_impressum, name="legal-impressum"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    # --- DASHBOARD (PREMIUM SPA) ---
    path("dashboard/", views.dashboard, name="dashboard"),
    path("dashboard/batiment/", views.dashboard_batiment, name="dashboard-batiment"),
    path("dashboard/dpe/", views.dashboard_dpe, name="dashboard-dpe"),
    path("dashboard/types/", views.dashboard_types, name="dashboard-types"),
    path("dashboard/dataset/upload/", views.dashboard_dataset_upload, name="dashboard-dataset-upload"),
    path("dashboard/dataset/<str:dataset_id>/", views.dashboard_dataset_explorer, name="dashboard-dataset-explorer"),
    # --- ADMIN ---
    path("admin_page/", views.admin_page, name="admin-page"),
    # --- API & DATA ---
    path("api/", include("data.urls"), name="data"),
    # path("test_app/", include("data_analysis.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
