"""Décorateurs personnalisés pour la gestion des accès dans l'application Django."""

from functools import wraps

from django.shortcuts import redirect


def anonymous_required(view_func, redirect_url="dashboard"):
    """Décorateur qui redirige les utilisateurs authentifiés vers le dashboard.

    Inverse de @login_required : protège les pages accessibles uniquement aux
    utilisateurs non connectés (ex: page de login).
    """

    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        """Vérifie l'état d'authentification avant d'exécuter la vue."""
        if request.user.is_authenticated:
            return redirect(redirect_url)
        return view_func(request, *args, **kwargs)

    return wrapper