import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "batimentRenovation.settings")
django.setup()

from batimentRenovation.models import User

# Créer un superutilisateur
if not User.objects.filter(email="admin@renovenergy.com").exists():
    User.objects.create_superuser(
        username="admin",
        email="admin@renovenergy.com",
        password="admin123",
        role="Admin",
    )
    print("✅ Superutilisateur créé avec succès!")
    print("Username: admin")
    print("Email: admin@renovenergy.com")
    print("Mot de passe: admin123")
else:
    # Réinitialiser le mot de passe
    user = User.objects.get(email="admin@renovenergy.com")
    user.set_password("admin123")
    user.save()
    print("✅ Mot de passe réinitialisé avec succès!")
    print("Email: admin@renovenergy.com")
    print("Nouveau mot de passe: admin123")
