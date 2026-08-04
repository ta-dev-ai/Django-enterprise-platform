"""Compte démo local — mot de passe toujours réinitialisé au démarrage login."""

from django.contrib.auth import get_user_model

DEMO_EMAIL = "demo@renovenergy.com"
DEMO_PASSWORD = "demo1234"
DEMO_USERNAME = "demo@renovenergy.com"


def ensure_demo_user():
    """Crée ou réinitialise le compte démo (portfolio / recruteurs)."""
    User = get_user_model()
    user = User.objects.filter(email=DEMO_EMAIL).first()

    if user is None:
        user = User(
            username=DEMO_USERNAME,
            email=DEMO_EMAIL,
            role=User.USER,
            is_active=True,
        )

    user.username = DEMO_USERNAME
    user.email = DEMO_EMAIL
    user.role = User.USER
    user.is_active = True
    user.set_password(DEMO_PASSWORD)
    user.save()
    return user
