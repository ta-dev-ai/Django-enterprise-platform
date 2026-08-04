"""Script de validation pour tester le branchement des lanceurs V1 et V2."""
import importlib
import os
import sys

# --- Configuration ---
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def check_module(name):
    try:
        importlib.import_module(name)
        return True
    except ImportError:
        return False


def check_path(path):
    return os.path.exists(path)


def main():
    print("=" * 60)
    print("  TEST DES LANCEURS - V1 & V2")
    print("=" * 60)

    # --- VÉRIF 1 : Dépendances Python ---
    print("\n[1] DÉPENDANCES PYTHON")
    deps = {
        "Django": check_module("django"),
        "PyQt6": check_module("PyQt6"),
        "PyQt6.QtWebEngineWidgets": check_module("PyQt6.QtWebEngineWidgets"),
        "Pandas": check_module("pandas"),
        "NumPy": check_module("numpy"),
    }
    for name, ok in deps.items():
        status = "✅ OK" if ok else "❌ MANQUANT"
        print(f"    {name}: {status}")

    # --- VÉRIF 2 : Chemins Lanceur V1 ---
    print("\n[2] LANCEUR V1 - DEMARRER.py")
    paths_v1 = {
        "DEMARRER.py": os.path.join(ROOT, "DEMARRER.py"),
        "V1 app_launcher.py": os.path.join(ROOT, "RenovateApp_Launcher", "app_launcher.py"),
        "V1 ui/launcher_ui.html": os.path.join(ROOT, "RenovateApp_Launcher", "ui", "launcher_ui.html"),
        "V1 requirements.txt": os.path.join(ROOT, "RenovateApp_Launcher", "requirements.txt"),
    }
    for name, path in paths_v1.items():
        status = "✅ OK" if check_path(path) else "❌ ABSENT"
        print(f"    {name}: {status} ({path})")

    # --- VÉRIF 3 : Chemins Lanceur V2 ---
    print("\n[3] LANCEUR V2 - 1_CLIC_DEMARRER_V2.py")
    paths_v2 = {
        "1_CLIC_DEMARRER_V2.py": os.path.join(ROOT, "app_launcher", "1_CLIC_DEMARRER_V2.py"),
        "V2 react-app/": os.path.join(ROOT, "app_launcher", "RenovateApp_Launcher_2", "ui2", "react-app"),
        "V2 package.json": os.path.join(ROOT, "app_launcher", "RenovateApp_Launcher_2", "ui2", "react-app", "package.json"),
        "V2 vite.config.js": os.path.join(ROOT, "app_launcher", "RenovateApp_Launcher_2", "ui2", "react-app", "vite.config.js"),
    }
    for name, path in paths_v2.items():
        status = "✅ OK" if check_path(path) else "❌ ABSENT"
        print(f"    {name}: {status} ({path})")

    # --- VÉRIF 4 : Bug connu app_launcher.py V2 ---
    print("\n[4] BUG CONNU - app_launcher.py V2 (copie du V1)")
    v2_launcher = os.path.join(ROOT, "app_launcher", "RenovateApp_Launcher_2", "app_launcher.py")
    if check_path(v2_launcher):
        with open(v2_launcher, "r", encoding="utf-8") as f:
            content = f.read()
        ui2_present = "ui2" in content
        print(f"    Le fichier V2 app_launcher.py référence 'ui2' ? {'✅ OUI' if ui2_present else '❌ NON (BUG: utilise ui/ au lieu de ui2/)'}")
    else:
        print(f"    ⚠️  V2 app_launcher.py absent (non utilisé par 1_CLIC_DEMARRER_V2.py)")

    # --- RÉSUMÉ ---
    print("\n" + "=" * 60)
    all_ok = all(deps.values()) and all(check_path(p) for p in list(paths_v1.values()) + list(paths_v2.values()))
    if all_ok:
        print("  ✅ TOUS LES LANCEURS SONT BRANCHÉS")
    else:
        print("  ⚠️  DES ÉLÉMENTS SONT MANQUANTS - Voir ci-dessus")
    print("=" * 60)


if __name__ == "__main__":
    main()
    sys.exit(0)