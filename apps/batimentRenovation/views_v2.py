from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# --- VUES V2 (Nouvelle Architecture Template) ---


def home_v2(request):
    """Page d'accueil V2"""
    return render(request, "pages/home.html")


def about_v2(request):
    """Page À propos V2"""
    return render(request, "pages/about.html")


def contact_v2(request):
    """Page Contact V2"""
    # Note: Pour l'instant on rend juste le template, la logique Formulaire restera à brancher plus tard si validé
    return render(request, "pages/contact.html")


@login_required(login_url="login-v2")
def dashboard_v2(request):
    """Dashboard Principal V2"""
    return render(request, "pages/dashboard/dashboard.html")


@login_required(login_url="login-v2")
def dashboard_batiment_v2(request):
    """Dashboard Bâtiments V2"""
    return render(request, "pages/dashboard/batiment.html")


@login_required(login_url="login-v2")
def dashboard_types_v2(request):
    """Dashboard Types V2"""
    return render(request, "pages/dashboard/types.html")


@login_required(login_url="login-v2")
def dashboard_dpe_v2(request):
    """Dashboard DPE V2"""
    return render(request, "pages/dashboard/dpe.html")


def login_v2(request):
    """Page de connexion V2"""
    from . import views

    return views.login(request, template_name="pages/login.html")


def logout_v2(request):
    """Déconnexion V2"""
    from django.contrib.auth import logout
    from django.shortcuts import redirect

    logout(request)
    return redirect("home-v2")


def admin_page_v2(request):
    """Page Admin V2"""
    return render(request, "pages/admin_page.html")
