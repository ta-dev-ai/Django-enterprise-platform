"""Vues Django du module batimentRenovation."""

import json
import os

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.http import require_http_methods

from .auth_service import handle_demo_login, handle_registration, handle_user_login
from .demo_auth import DEMO_EMAIL, DEMO_PASSWORD, ensure_demo_user
from .forms import ContactForm, LoginForm, SignupForm


def index(request):
    """Affiche la page d'accueil."""
    return render(request, "pages/home.html")


def cv(request):
    """Affiche le CV au format JSON."""
    json_path = os.path.join(settings.BASE_DIR, "static", "data", "cv_data.json")
    with open(json_path, "r", encoding="utf-8") as f:
        cv_data = json.load(f)
    return render(request, "pages/cv_tayier.html", {"cv": cv_data})


@login_required
def dashboard(request):
    """Affiche le tableau de bord principal."""
    return render(request, "pages/dashboard/dashboard.html")


@login_required
def dashboard_batiment(request):
    """Affiche la section bâtiments du dashboard."""
    return render(request, "pages/dashboard/batiment.html")


@login_required
def dashboard_dpe(request):
    """Affiche la section DPE du dashboard."""
    return render(request, "pages/dashboard/dpe.html")


@login_required
def dashboard_types(request):
    """Affiche la section types de travaux du dashboard."""
    return render(request, "pages/dashboard/types.html")


@login_required
def dashboard_dataset_upload(request):
    """Affiche la page d'upload de dataset."""
    return render(request, "pages/dashboard/dataset_upload.html")


@login_required
def dashboard_dataset_explorer(request, dataset_id):
    """Affiche l'explorateur de dataset."""
    return render(
        request,
        "pages/dashboard/dataset_explorer.html",
        {"dataset_id": dataset_id},
    )


def about(request):
    """Affiche la page À propos."""
    return render(request, "pages/about.html")


def legal_mentions(request):
    """Affiche les mentions légales."""
    return render(request, "pages/legal/mentions_legales.html")


def legal_privacy(request):
    """Affiche la politique de confidentialité."""
    return render(request, "pages/legal/confidentialite.html")


def legal_impressum(request):
    """Affiche l'impressum."""
    return render(request, "pages/legal/impressum.html")


@require_http_methods(["GET", "POST"])
def login(request, template_name="pages/login.html"):
    """Vue d'authentification — délègue la logique à auth_service."""
    if request.user.is_authenticated:
        return redirect("dashboard")

    ensure_demo_user()
    mode = request.GET.get("mode", "login")

    if request.method == "POST":
        if mode == "demo":
            handle_demo_login(request, DEMO_EMAIL, DEMO_PASSWORD)
            if request.user.is_authenticated:
                return redirect("dashboard")
        elif mode == "register":
            form = SignupForm(request.POST)
            if handle_registration(request, form):
                return redirect("dashboard")
        else:
            form = LoginForm(request.POST)
            if handle_user_login(request, form):
                return redirect("dashboard")

    context = {
        "login_form": LoginForm(),
        "signup_form": SignupForm(),
        "mode": mode,
        "demo_email": DEMO_EMAIL,
        "demo_password": DEMO_PASSWORD,
    }
    return render(request, template_name, context)


def logout(request):
    """Déconnecte l'utilisateur et redirige vers la page de login."""
    auth_logout(request)
    return redirect("login")


def admin_page(request):
    """Affiche la page d'administration."""
    return render(request, "pages/admin_page.html")


def contact(request):
    """Affiche et traite le formulaire de contact."""
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            instance = form.save()
            form.send_email(instance)
            return redirect("contact")
    else:
        form = ContactForm()

    return render(request, "pages/contact.html", {"form": form})
