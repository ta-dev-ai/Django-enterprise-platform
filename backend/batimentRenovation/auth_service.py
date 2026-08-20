"""Service d'authentification Django — extrait de la vue login pour alléger les vues."""

from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages


def handle_demo_login(request, demo_email, demo_password):
    """Traite la connexion démo rapide (un clic)."""
    user = authenticate(request=request, username=demo_email, password=demo_password)
    if user and user.is_active:
        auth_login(request, user)
        messages.success(request, "Connexion démo — bienvenue !")
        return True
    messages.error(request, "Connexion démo indisponible.")
    return False


def handle_registration(request, form):
    """Traite l'inscription d'un nouvel utilisateur."""
    if not form.is_valid():
        return False
    user = form.save()
    if user and user.is_active:
        auth_login(request, user)
        messages.success(request, f"Compte créé ! Bienvenue {user.email}")
        return True
    messages.error(request, "Erreur création compte.")
    return False


def handle_user_login(request, form):
    """Traite la connexion d'un utilisateur existant."""
    if not form.is_valid():
        return False
    user = authenticate(
        request=request,
        username=form.cleaned_data["email"],
        password=form.cleaned_data["password"],
    )
    if user and user.is_active:
        auth_login(request, user)
        messages.success(request, f"Bonjour, {user.email} !")
        return True
    messages.error(request, "Identifiants invalides.")
    return False
