"""Formulaires Django de l'application batimentRenovation."""

from django import forms
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.core.mail import send_mail

from .models import ContactMessage


class ContactForm(forms.ModelForm):
    """Formulaire de contact envoyant un email à l'administrateur."""

    class Meta:
        """Configuration du ModelForm ContactForm."""

        model = ContactMessage
        fields = ["name", "email", "subject", "message"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "contact-input", "placeholder": "Votre Nom"}),
            "email": forms.EmailInput(attrs={"class": "contact-input", "placeholder": "Votre Email"}),
            "subject": forms.TextInput(attrs={"class": "contact-input", "placeholder": "Sujet de votre message"}),
            "message": forms.Textarea(attrs={"class": "contact-textarea", "placeholder": "Votre Message", "rows": 5}),
        }

    def send_email(self, instance: ContactMessage) -> None:
        """Envoie l'email de notification à l'administrateur après sauvegarde du message."""
        subject = instance.subject or "Nouveau message de contact"
        full_message = (
            f"De: {instance.name} <{instance.email}>\n\n"
            f"Message:\n{instance.message}\n\n"
            f"Reçu le: {instance.created_at}"
        )
        send_mail(
            subject=subject,
            message=full_message,
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", instance.email),
            recipient_list=[getattr(settings, "CONTACT_RECIPIENT_EMAIL", "admin@example.com")],
            fail_silently=False,
        )


class LoginForm(forms.Form):
    """Formulaire de connexion par email et mot de passe."""

    email = forms.EmailField(
        max_length=150,
        label="Email",
        widget=forms.EmailInput(attrs={"class": "auth-input", "placeholder": "votre@email.com"}),
    )
    password = forms.CharField(
        max_length=63,
        label="Mot de passe",
        widget=forms.PasswordInput(attrs={"class": "auth-input", "placeholder": "••••••••"}),
    )


User = get_user_model()


class SignupForm(UserCreationForm):
    """Formulaire d'inscription avec création de compte via email."""

    email = forms.EmailField(
        max_length=150,
        required=True,
        label="Email",
        widget=forms.EmailInput(attrs={"class": "auth-input", "placeholder": "votre@email.com"}),
    )

    class Meta:
        """Configuration du ModelForm SignupForm."""

        model = User
        fields = ["email"]

    def __init__(self, *args, **kwargs):
        """Personnalise les widgets et labels des champs de mot de passe."""
        super().__init__(*args, **kwargs)
        self.fields["password1"].widget.attrs.update({"class": "auth-input", "placeholder": "••••••••"})
        self.fields["password2"].widget.attrs.update({"class": "auth-input", "placeholder": "••••••••"})
        self.fields["password1"].label = "Mot de passe"
        self.fields["password2"].label = "Confirmer le mot de passe"

    def save(self, commit=True):
        """Sauvegarde l'utilisateur en alignant username sur email et en assignant le rôle USER."""
        user = super().save(commit=False)
        email = self.cleaned_data["email"]
        user.email = email
        if not user.username:
            user.username = email
        if hasattr(user, "role"):
            user.role = User.USER
        if commit:
            user.save()
        return user