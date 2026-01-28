from django.contrib import admin
from django.urls import path, include
from . import views  # ← Importer les vues
from . import views_v2  # ← Importer les vues V2

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.index, name="home"),  # ← Ta page d'accueil
    path("dashboard/", views.dashboard, name="dashboard"),
    path("dashboard/batiment/", views.dashboard_batiment, name="dashboard-batiment"),
    path("dashboard/dpe/", views.dashboard_dpe, name="dashboard-dpe"),
    path("dashboard/types/", views.dashboard_types, name="dashboard-types"),
    path("about/", views.about, name="about"),
    path("contact/", views.contact, name="contact"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("admin_page/", views.admin_page, name="admin-page"),
    path("api/", include("data.urls"), name="data"),
    path("test_app/", include("apps.data_analysis.urls")),
    path("test-migration/", views.test_migration_html, name="test-migration"),
    # --- ROUTES V2 (NOUVELLE ARCHITECTURE) ---
    path("v2/", views_v2.home_v2, name="home-v2"),
    path("v2/about/", views_v2.about_v2, name="about-v2"),
    path("v2/contact/", views_v2.contact_v2, name="contact-v2"),
    path("v2/dashboard/", views_v2.dashboard_v2, name="dashboard-v2"),
    path(
        "v2/dashboard/batiment/",
        views_v2.dashboard_batiment_v2,
        name="dashboard-batiment-v2",
    ),
    path("v2/dashboard/types/", views_v2.dashboard_types_v2, name="dashboard-types-v2"),
    path("v2/dashboard/dpe/", views_v2.dashboard_dpe_v2, name="dashboard-dpe-v2"),
    path("v2/login/", views_v2.login_v2, name="login-v2"),
    path("v2/logout/", views_v2.logout_v2, name="logout-v2"),
    path("v2/admin_page/", views_v2.admin_page_v2, name="admin-page-v2"),
]
