"""Modèles de données de l'application batimentRenovation."""

from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Modèle utilisateur personnalisé avec authentification par email."""

    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    USER = 'USER'
    ADMIN = 'ADMIN'

    ROLES_CHOICES = (
        (USER, "Utilisateur"),
        (ADMIN, "Administrateur"),
    )

    role = models.CharField(max_length=30, choices=ROLES_CHOICES, verbose_name='Rôle')

    def __str__(self):
        """Retourne la représentation textuelle de l'utilisateur."""
        return self.email


class ContactMessage(models.Model):
    """Modèle représentant un message envoyé via le formulaire de contact."""

    name = models.CharField("Nom", max_length=100)
    email = models.EmailField("Email")
    subject = models.CharField("Sujet", max_length=150, blank=True)
    message = models.TextField("Message")
    created_at = models.DateTimeField("Reçu le", auto_now_add=True)

    class Meta:
        """Méta-configuration du modèle ContactMessage."""

        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"
        ordering = ["-created_at"]

    def __str__(self):
        """Retourne la représentation textuelle du message."""
        return f"{self.name} - {self.subject or 'Sans sujet'}"
