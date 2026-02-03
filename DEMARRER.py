import os
import sys
import subprocess
import time
import webbrowser
import platform

# --- CONFIGURATION ---
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
LAUNCHER_PATH = os.path.join(ROOT_DIR, "RenovateApp_Launcher", "app_launcher.py")
REQUIREMENTS_FILE = os.path.join(ROOT_DIR, "RenovateApp_Launcher", "requirements.txt")


def clear_screen():
    os.system("cls" if os.name == "nt" else "clear")


def print_banner():
    print("=" * 60)
    print("   🏗️  ECOSYSTÈME RÉNOVATION ÉNERGÉTIQUE PARIS")
    print("      Core: Django MVT | Gateway: Launcher PyQt6")
    print("      Développement & Vision by Tayierjiang Tayier")
    print("=" * 60)


def install_python_deps():
    print("\n[PHASE 0] 🐍 Vérification des dépendances Python (PyQt6, Django)...")

    # Check if we can import key packages
    missing_packages = []

    # Check PyQt6
    try:
        import PyQt6
    except ImportError:
        missing_packages.append("PyQt6")

    # Check Django
    try:
        import django
    except ImportError:
        missing_packages.append("Django")

    if missing_packages:
        print(f"   ⚠️  Composants manquants détectés : {', '.join(missing_packages)}")
        print("   📦 INSTALLATION AUTOMATIQUE... (Cela peut prendre 1 minute)")

        try:
            # Upgrade pip first just in case
            subprocess.check_call(
                [sys.executable, "-m", "pip", "install", "--upgrade", "pip"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )

            # Install from requirements.txt
            if os.path.exists(REQUIREMENTS_FILE):
                subprocess.check_call(
                    [
                        sys.executable,
                        "-m",
                        "pip",
                        "install",
                        "--no-warn-script-location",
                        "-r",
                        REQUIREMENTS_FILE,
                    ]
                )
            else:
                # Fallback manual install if requirements.txt missing
                print(
                    f"   ⚠️  Fichier {REQUIREMENTS_FILE} introuvable. Installation manuelle..."
                )
                subprocess.check_call(
                    [
                        sys.executable,
                        "-m",
                        "pip",
                        "install",
                        "PyQt6",
                        "PyQt6-WebEngine",
                        "Django",
                        "requests",
                        "pandas",
                    ]
                )

            print("   ✅ Installation réussie !")
        except Exception as e:
            print(f"   ❌ Erreur lors de l'installation : {e}")
            print(
                "   Veuillez vérifier votre connexion internet ou vos droits administrateur."
            )
            input("Appuyez sur Entrée pour quitter...")
            sys.exit(1)
    else:
        print("   ✅ Tous les modules Python sont présents.")


def start_launcher():
    print("\n[PHASE 1] 🚀 Lancement de l'interface V1...")

    if not os.path.exists(LAUNCHER_PATH):
        print(f"   ❌ Erreur: Le fichier launcher est introuvable: {LAUNCHER_PATH}")
        input("Appuyez sur Entrée pour quitter...")
        sys.exit(1)

    try:
        # On utilise le même python (sys.executable) qui a maintenant les dépendances
        subprocess.call([sys.executable, LAUNCHER_PATH])
    except Exception as e:
        print(f"   ❌ Erreur au lancement : {e}")
        input("Appuyez sur Entrée pour fermer...")


if __name__ == "__main__":
    clear_screen()
    print_banner()

    # STEP 0: Auto-Fix Dependencies
    install_python_deps()

    # STEP 1: Run
    start_launcher()
