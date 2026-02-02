from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    # --- MAIN SITE (PREMIUM SPA) ---
    path("", views.index, name="home"),
    path("about/", views.about, name="about"),
    path("contact/", views.contact, name="contact"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    # --- DASHBOARD (PREMIUM SPA) ---
    path("dashboard/", views.dashboard, name="dashboard"),
    path("dashboard/batiment/", views.dashboard_batiment, name="dashboard-batiment"),
    path("dashboard/dpe/", views.dashboard_dpe, name="dashboard-dpe"),
    path("dashboard/types/", views.dashboard_types, name="dashboard-types"),
    # --- ADMIN ---
    path("admin_page/", views.admin_page, name="admin-page"),
    # --- API & DATA ---
    path("api/", include("data.urls"), name="data"),
    path("test_app/", include("data_analysis.urls")),
]
