"""Processeurs de contexte globaux pour les templates Django."""

from .site_config import SITE_CONTACT


def site_contact(request):
    """Injecte les informations de contact dans tous les templates."""
    return {"site": SITE_CONTACT}
