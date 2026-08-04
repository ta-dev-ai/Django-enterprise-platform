"""
=====================================================================
LANCEUR UNIFIÉ - Couche Connecteur
=====================================================================
Réutilise les 2 lanceurs existants (V1 + V2) via une interface unifiée.

Approche : urlChanged (robuste, pas de QWebChannel)
- Bouton "Web MVT"       → URL: http://launch-webmvt/
- Bouton "Déployer"      → URL: http://launch-react-deploy/
- Bouton "Démarrer dir." → URL: http://launch-react-dev/

Vérifications :
- Dépendances BACKEND (Python) : Django, PyQt6, Pandas, NumPy
- Dépendances FRONTEND (React) : node_modules
- Serveur Django :8000 déjà démarré ? → requête HTTP
- Dernier déploiement React : vérifie dist/ + affiche la date

Auteur : Tayierjiang Tayier — Architecte Logiciel Senior
Date : Avril 2026
=====================================================================
"""

import os
import sys
import subprocess
import socket
import time
import json
import datetime
import urllib.request
import urllib.error
from pathlib import Path

from PyQt6.QtWidgets import QApplication, QMainWindow
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtCore import QUrl, QTimer


# --- CONFIGURATION ---
ROOT_DIR = Path(__file__).resolve().parent.parent  # racine du projet
LAUNCHER_DIR = Path(__file__).resolve().parent      # launcher/

# Backend et React
BACKEND_DIR = ROOT_DIR / "backend"
REACT_DIR = ROOT_DIR / "desktop-react" / "ui" / "react-app"
REQUIREMENTS_FILE = BACKEND_DIR / "requirements.txt"

SERVER_HOST = "127.0.0.1"
DJANGO_PORT = 8000
REACT_PORT = 5174


class UnifiedLauncher(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Renovate Energy - Unified Launcher")
        self.resize(1100, 750)

        self.server_process = None
        self.react_process = None
        self.is_processing = False  # Garde-fou anti-réentrance

        # 1. Navigateur
        self.browser = QWebEngineView()
        self.setCentralWidget(self.browser)

        # 2. Interception des clics via URL
        self.browser.urlChanged.connect(self.check_trigger)

        # 3. Charger l'UI unifiée
        ui_file = LAUNCHER_DIR / "unified_ui.html"
        self.browser.setUrl(QUrl.fromLocalFile(str(ui_file)))

        # 4. Vérifications initiales (après chargement de la page)
        QTimer.singleShot(1500, self.check_dependencies)

    # ---------------------------------------------------------------
    #  INTERCEPTION DES CLICS (via URL)
    # ---------------------------------------------------------------
    def check_trigger(self, url):
        """Détecte les clics sur les boutons via changement d'URL"""
        # Garde-fou : ignorer si déjà en cours de traitement
        if self.is_processing:
            return

        url_str = url.toString()

        if "launch-webmvt" in url_str:
            self.is_processing = True
            self.log("\n>>> Bouton 'Web MVT' cliqué")
            self.start_web_mvt()
            # Recharger l'UI pour réinitialiser
            ui_file = LAUNCHER_DIR / "unified_ui.html"
            self.browser.setUrl(QUrl.fromLocalFile(str(ui_file)))
            self.is_processing = False

        elif "launch-react-deploy" in url_str:
            self.is_processing = True
            self.log("\n>>> Bouton 'Déployer' cliqué")
            self.start_react("deploy")
            ui_file = LAUNCHER_DIR / "unified_ui.html"
            self.browser.setUrl(QUrl.fromLocalFile(str(ui_file)))
            self.is_processing = False

        elif "launch-react-dev" in url_str:
            self.is_processing = True
            self.log("\n>>> Bouton 'Démarrage direct' cliqué")
            self.start_react("dev")
            ui_file = LAUNCHER_DIR / "unified_ui.html"
            self.browser.setUrl(QUrl.fromLocalFile(str(ui_file)))
            self.is_processing = False

    # ---------------------------------------------------------------
    #  LOG - Envoi des logs vers le JS
    # ---------------------------------------------------------------
    def log(self, message):
        """Affiche un message dans la zone de logs du HTML"""
        msg_json = json.dumps(str(message).replace("\\", "/"))
        js = f"window.appendLog({msg_json});"
        self.browser.page().runJavaScript(js)

    def set_status(self, element, status):
        """Met à jour un indicateur de statut dans le HTML"""
        js = f"window.setStatus('{element}', '{status}');"
        self.browser.page().runJavaScript(js)

    def set_deploy_info(self, text):
        """Met à jour l'info de déploiement dans le HTML"""
        msg_json = json.dumps(text)
        js = f"window.setDeployInfo({msg_json});"
        self.browser.page().runJavaScript(js)

    # ---------------------------------------------------------------
    #  VÉRIFICATION DES DÉPENDANCES
    # ---------------------------------------------------------------
    def check_dependencies(self):
        self.log("")
        self.log("🔍 VÉRIFICATION DES DÉPENDANCES...")

        # --- BACKEND (Python) ---
        self.log("\n[BACKEND] Vérification des modules Python...")
        backend_ok = True

        modules = {
            "Django": "django",
            "PyQt6": "PyQt6",
            "PyQt6-WebEngine": "PyQt6.QtWebEngineWidgets",
            "Pandas": "pandas",
            "NumPy": "numpy",
        }

        missing = []
        for label, module in modules.items():
            try:
                __import__(module)
                self.log(f"  ✅ {label}: présent")
            except ImportError:
                self.log(f"  ❌ {label}: MANQUANT")
                missing.append(module)
                backend_ok = False

        if missing:
            self.log(f"\n  📦 Installation des modules manquants : {len(missing)}...")
            try:
                subprocess.check_call(
                    [sys.executable, "-m", "pip", "install", "-r", str(REQUIREMENTS_FILE)],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                )
                self.log("  ✅ Dépendances backend installées")
                backend_ok = True
            except Exception as e:
                self.log(f"  ❌ Échec installation backend : {e}")

        self.set_status("backend", "ok" if backend_ok else "error")

        # --- FRONTEND (React) ---
        self.log("\n[FRONTEND] Vérification du React (node_modules)...")
        node_modules_dir = REACT_DIR / "node_modules"
        node_ok = False

        if node_modules_dir.exists():
            self.log("  ✅ node_modules: présent")
            node_ok = True
        else:
            self.log("  ❌ node_modules: MANQUANT")
            # Ne pas installer automatiquement, juste signaler

        self.set_status("frontend", "ok" if node_ok else "error")

        # --- Vérification Node/npm ---
        self.log("\n[FRONTEND] Vérification node/npm...")
        try:
            subprocess.check_call(["node", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            self.log("  ✅ Node.js présent")
        except:
            self.log("  ❌ Node.js ABSENT")
            node_ok = False

        try:
            subprocess.check_call(["npm.cmd", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            self.log("  ✅ npm présent")
        except:
            self.log("  ❌ npm ABSENT")
            node_ok = False

        self.set_status("node", "ok" if node_ok else "error")

        # --- Vérification du dernier déploiement React ---
        self.log("\n[REACT] Vérification du dernier déploiement...")
        self.check_deploy_info()

        self.log("\n✅ Vérification des dépendances terminée.")

    # ---------------------------------------------------------------
    #  VÉRIFICATION DU DERNIER DÉPLOIEMENT REACT
    # ---------------------------------------------------------------
    def check_deploy_info(self):
        """Vérifie si un build React existe et affiche sa date"""
        dist_dir = REACT_DIR / "dist"
        if dist_dir.exists():
            mtime = dist_dir.stat().st_mtime
            date_str = datetime.datetime.fromtimestamp(mtime).strftime("%d/%m/%Y %H:%M")
            self.log(f"  📦 Dernier déploiement : {date_str}")
            self.set_deploy_info(f"📦 Dernier déploiement : {date_str}")
            return True
        else:
            self.log("  📦 Aucun déploiement trouvé (build requis)")
            self.set_deploy_info("📦 Aucun déploiement — build requis")
            return False

    # ---------------------------------------------------------------
    #  VÉRIFICATION DU SERVEUR DJANGO
    # ---------------------------------------------------------------
    def is_server_running(self, port=DJANGO_PORT):
        """Teste si le serveur répond sur le port (n'importe quel statut HTTP = serveur en ligne)"""
        try:
            url = f"http://{SERVER_HOST}:{port}/"
            req = urllib.request.Request(url, method="GET")
            with urllib.request.urlopen(req, timeout=2) as resp:
                # N'importe quelle réponse HTTP (200, 302, 404) = serveur en ligne
                return True
        except urllib.error.HTTPError:
            # HTTPError (404, 302, etc.) = le serveur répond quand même
            return True
        except:
            # ConnectionError = le serveur ne répond pas
            return False

    def start_django_if_needed(self):
        """Démarre Django si le serveur n'est pas déjà en ligne"""
        self.log("\n[BACKEND] Vérification du serveur Django...")

        if self.is_server_running(DJANGO_PORT):
            self.log(f"  ✅ Serveur déjà démarré sur :{DJANGO_PORT} — réutilisation")
            self.set_status("server", "ok")
            return DJANGO_PORT, True

        self.log(f"  ⚠️  Serveur non démarré. Démarrage sur :{DJANGO_PORT}...")

        try:
            self.server_process = subprocess.Popen(
                [sys.executable, str(BACKEND_DIR / "manage.py"), "runserver", str(DJANGO_PORT)],
                cwd=str(BACKEND_DIR),
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
            )
        except Exception as e:
            self.log(f"  ❌ Erreur démarrage Django : {e}")
            return None, False

        self.log("  ⏳ Attente du serveur...")
        for i in range(20):
            time.sleep(0.5)
            if self.is_server_running(DJANGO_PORT):
                self.log("  ✅ Serveur Django démarré !")
                self.set_status("server", "ok")
                return DJANGO_PORT, True

        self.log("  ❌ Le serveur ne répond pas après 10s")
        self.set_status("server", "error")
        return None, False

    # ---------------------------------------------------------------
    #  LANCEMENT WEB MVT
    # ---------------------------------------------------------------
    def start_web_mvt(self):
        self.log("\n🌐 LANCEMENT WEB MVT (Django MVT)...")

        # 1. Vérifier serveur Django
        port, started = self.start_django_if_needed()
        if not port:
            return

        # 2. Ouvrir navigateur
        self.log(f"\n  🌍 Ouverture du navigateur sur http://{SERVER_HOST}:{port}/dashboard/")
        url = f"http://{SERVER_HOST}:{port}/dashboard/"
        QTimer.singleShot(1000, lambda: self._open_url(url))
        self.log("  ✅ Web MVT lancé !")

    # ---------------------------------------------------------------
    #  LANCEMENT REACT
    # ---------------------------------------------------------------
    def start_react(self, choice):
        self.log(f"\n⚛️ LANCEMENT REACT (choix : {choice})...")

        # 1. Vérifier serveur Django
        port, started = self.start_django_if_needed()
        if not port:
            return

        # 2. Vérifier node_modules
        if not (REACT_DIR / "node_modules").exists():
            self.log("\n  ⚠️  node_modules manquant → npm install...")
            try:
                subprocess.run(["npm.cmd", "install"], cwd=str(REACT_DIR), shell=True, timeout=180)
                self.log("  ✅ node_modules installé")
            except Exception as e:
                self.log(f"  ❌ Échec npm install : {e}")
                return

        # 3. Lancer React selon le choix
        self.log("")
        if choice == "deploy":
            # MODE DÉPLOIEMENT : recompiler (build) puis servir
            self.log("  📦 MODE DÉPLOIEMENT : recompilation (vite build)...")
            try:
                self.log("  ⏳ Compilation (vite build)...")
                subprocess.run(["npm.cmd", "run", "build"], cwd=str(REACT_DIR), shell=True, timeout=120)
                self.log("  ✅ Build terminé !")
                self.check_deploy_info()
                self.log("  ⏳ Démarrage du serveur de preview...")
                self.react_process = subprocess.Popen(
                    ["npm.cmd", "run", "preview"], cwd=str(REACT_DIR), shell=True
                )
            except Exception as e:
                self.log(f"  ❌ Erreur build : {e}")
                return
        else:
            # MODE DÉMARRAGE DIRECT : vérifier si un build existe
            self.log("  🚀 MODE DÉMARRAGE DIRECT...")
            has_build = self.check_deploy_info()

            if has_build:
                self.log("  ✅ Déploiement existant trouvé → utilisation directe")
                self.log("  ⏳ Démarrage du serveur de preview...")
                self.react_process = subprocess.Popen(
                    ["npm.cmd", "run", "preview"], cwd=str(REACT_DIR), shell=True
                )
            else:
                self.log("  ⚠️  Aucun déploiement → compilation puis démarrage...")
                try:
                    self.log("  ⏳ Compilation (vite build)...")
                    subprocess.run(["npm.cmd", "run", "build"], cwd=str(REACT_DIR), shell=True, timeout=120)
                    self.log("  ✅ Build terminé !")
                    self.check_deploy_info()
                    self.log("  ⏳ Démarrage du serveur de preview...")
                    self.react_process = subprocess.Popen(
                        ["npm.cmd", "run", "preview"], cwd=str(REACT_DIR), shell=True
                    )
                except Exception as e:
                    self.log(f"  ❌ Erreur : {e}")
                    self.log("  ⚠️  Fallback : démarrage en mode dev...")
                    self.react_process = subprocess.Popen(
                        ["npm.cmd", "run", "dev"], cwd=str(REACT_DIR), shell=True
                    )

        # 4. Attendre que le serveur React réponde
        self.log(f"  ⏳ Attente du React sur :{REACT_PORT}...")
        for i in range(20):
            time.sleep(0.5)
            if self.is_server_running(REACT_PORT):
                self.log(f"  ✅ React démarré sur :{REACT_PORT} !")
                break

        # 5. Ouvrir navigateur
        url = f"http://{SERVER_HOST}:{REACT_PORT}"
        self.log(f"\n  🌍 Ouverture du navigateur sur {url}")
        QTimer.singleShot(1000, lambda: self._open_url(url))
        self.log("  ✅ React lancé !")

    # ---------------------------------------------------------------
    #  UTILITAIRES
    # ---------------------------------------------------------------
    def _open_url(self, url):
        import webbrowser
        webbrowser.open(url)

    def closeEvent(self, event):
        event.accept()


# =====================================================================
#  POINT D'ENTRÉE
# =====================================================================
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = UnifiedLauncher()
    window.show()
    sys.exit(app.exec())