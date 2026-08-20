"""Backend d'authentification personnalisé permettant la connexion par email ou username."""

from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q

User = get_user_model()


class EmailBackend(ModelBackend):
    """Backend d'authentification qui accepte l'email ou le username comme identifiant."""

    def authenticate(self, request, email=None, password=None, **kwargs):
        """Authentifie un utilisateur via son email ou son username."""
        try:
            user = User.objects.get(Q(email__iexact=email) | Q(username__iexact=email))
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
        except User.DoesNotExist:
            return None
        return None

    def user_can_authenticate(self, user):
        """Vérifie que l'utilisateur est actif et autorisé à se connecter."""
        return user.is_active
