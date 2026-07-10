from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.views.decorators.http import require_http_methods
from django.views.decorators.cache import cache_page
from django.contrib.auth.decorators import login_required
from .forms import ContactForm, LoginForm, SignupForm
from .decorators import anonymous_required
from .demo_auth import DEMO_EMAIL, DEMO_PASSWORD, ensure_demo_user


import json
import os
from django.conf import settings
from django.shortcuts import render, redirect

def index(request):
    return render(request, "pages/home.html")


def cv(request):
    json_path = os.path.join(settings.BASE_DIR, "static", "data", "cv_data.json")
    with open(json_path, "r", encoding="utf-8") as f:
        cv_data = json.load(f)
    print(f"✅ CV Data Loaded: {cv_data.get('header', {}).get('name')}")
    return render(request, "pages/cv_tayier.html", {"cv": cv_data})


@login_required
def dashboard(request):
    return render(request, "pages/dashboard/dashboard.html")


@login_required
def dashboard_batiment(request):
    return render(request, "pages/dashboard/batiment.html")


@login_required
def dashboard_dpe(request):
    return render(request, "pages/dashboard/dpe.html")


@login_required
def dashboard_types(request):
    return render(request, "pages/dashboard/types.html")


def about(request):
    return render(request, "pages/about.html")


def legal_mentions(request):
    return render(request, "pages/legal/mentions_legales.html")


def legal_privacy(request):
    return render(request, "pages/legal/confidentialite.html")


def legal_impressum(request):
    return render(request, "pages/legal/impressum.html")


@require_http_methods(["GET", "POST"])
def login(request, template_name="pages/login.html"):
    if request.user.is_authenticated:
        return redirect("dashboard")

    ensure_demo_user()

    mode = request.GET.get("mode", "login")

    if request.method == "POST" and mode == "demo":
        user = authenticate(
            request=request,
            username=DEMO_EMAIL,
            password=DEMO_PASSWORD,
        )
        if user and user.is_active:
            auth_login(request, user)
            messages.success(request, "Connexion démo — bienvenue !")
            return redirect("dashboard")
        messages.error(request, "Connexion démo indisponible.")

    if request.method == "POST":
        print("📤 POST détecté")

        if mode == "register":
            print("📝 Traitement INSCRIPTION")
            form = SignupForm(request.POST)
            if form.is_valid():
                print("✅ Form Signup valide")
                user = form.save()
                print(f"✅ User créé: {user} (ID: {user.id}, email: {user.email})")

                # Vérif user actif
                if user and user.is_active:
                    auth_login(request, user)
                    print("✅ Auto-login OK")
                    messages.success(request, f"Compte créé ! Bienvenue {user.email}")
                    return redirect("dashboard")
                else:
                    print(f"❌ User inactif: {user.is_active if user else 'None'}")
                    messages.error(request, "Erreur création compte.")
            else:
                print("❌ Form Signup invalide:", form.errors)

        else:  # login
            print("🔑 Traitement CONNEXION")
            form = LoginForm(request.POST)
            if form.is_valid():
                print("✅ Form Login valide")
                print(f"🔍 Tentative login: {form.cleaned_data['email']}")

                user = authenticate(
                    request=request,
                    username=form.cleaned_data["email"],  # username=email
                    password=form.cleaned_data["password"],
                )
                print(f"🔍 Authenticate retourne: {user}")

                if user and user.is_active:
                    auth_login(request, user)
                    print("✅ Login OK")
                    messages.success(request, f"Bonjour, {user.email} !")
                    return redirect("dashboard")
                else:
                    print("❌ Login échoué - user inactif ou None")
                    messages.error(request, "Identifiants invalides.")
            else:
                print("❌ Form Login invalide:", form.errors)

    # Affichage forms
    login_form = LoginForm()
    signup_form = SignupForm()

    context = {
        "login_form": login_form,
        "signup_form": signup_form,
        "mode": mode,
        "demo_email": DEMO_EMAIL,
        "demo_password": DEMO_PASSWORD,
    }
    return render(request, template_name, context)


def logout(request):
    auth_logout(request)
    return redirect("login")


def admin_page(request):
    return render(request, "pages/admin_page.html")


def contact(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            # 1) on sauve le message dans la base
            instance = form.save()
            # 2) on envoie l'email
            form.send_email(instance)
            # 3) redirection (évite le resoumission du formulaire)
            return redirect("contact")  # ou une page 'merci'
    else:
        form = ContactForm()

    return render(request, "pages/contact.html", {"form": form})
