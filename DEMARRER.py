import sys
import os
import subprocess

def main():
    print("==========================================")
    print("   RENOVATE ENERGY - SYSTEME AUTONOME")
    print("==========================================")

    root_dir = os.path.dirname(os.path.abspath(__file__))
    launcher_path = os.path.join(root_dir, "RenovateApp_Launcher", "app_launcher.py")
    venv_python = os.path.join(root_dir, "RenovateApp_Launcher", "engine", "venv", "Scripts", "python.exe")
    req_file = os.path.join(root_dir, "RenovateApp_Launcher", "requirements.txt")

    # Logique de sélection Python
    target_python = sys.executable
    use_portable = False

    # 1. Tentative Mode Portable
    if os.path.exists(venv_python):
        # Vérification rapide si le venv est fonctionnel (ex: peut importer Django)
        try:
            subprocess.check_call(
                [venv_python, "-c", "import django"], 
                stdout=subprocess.DEVNULL, 
                stderr=subprocess.DEVNULL
            )
            print("[BOOT] Mode Portable (Venv) activé.")
            target_python = venv_python
            use_portable = True
        except subprocess.CalledProcessError:
            print("[INFO] Venv portable détecté mais incomplet ou défectueux.")
    
    # 2. Mode Système (Fallback si le portable a échoué)
    if not use_portable:
        print(f"[BOOT] Mode Système (Fallback) sur : {target_python}")
        print("[INFO] Vérification des dépendances...")
        try:
            # Installation automatique des libs
            subprocess.check_call([target_python, "-m", "pip", "install", "-r", req_file])
        except Exception as e:
            print(f"[ERREUR] Impossible d'installer les dépendances : {e}")
            input("Appuyez sur Entrée pour quitter...")
            return

    # 3. Lancement de l'Application
    print(f"[BOOT] Lancement du Launcher...")
    try:
        # On lance le script launcher avec le python choisi
        # Pour les utilisateurs Windows sans console (si lancé via double clic sur .pyw par ex),
        # mais ici c'est un .py console.
        subprocess.call([target_python, launcher_path])
    except Exception as e:
        print(f"[ERREUR CRITIQUE] L'application a planté : {e}")
        input("Appuyez sur Entrée pour fermer...")

if __name__ == "__main__":
    main()
