"""
=====================================================================
LANCEUR UNIFIÉ - Couche Connecteur
=====================================================================
Réutilise les 2 lanceurs existants (V1 + V2) via une interface unifiée.

- Bouton 1 : Web MVT  → appelle web-mvt/launcher/app_launcher.py
- Bouton 2 : React    → appelle desktop-react/launcher/app_launcher.py

Vérifications :
- Dépendances BACKEND (Python) : Django, PyQt6, Pandas, NumPy
- Dépendances FRONTEND (React) : node_modules
- Serveur Django :8000 déjà démarré ? → requête HTTP
- Port Libre : si :8000 occupé par autre chose → cherche port libre

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
import urllib.request
import urllib.error
from pathlib import Path

from PyQt6.QtWidgets import QApplication, QMainWindow
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtCore import QUrl, QTimer
from PyQt6.QtWebChannel import QWebChannel
from PyQt6.QtCore import QObject, pyqtSlot

# --- CONFIGURATION ---
ROOT_DIR = Path(__file__).resolve().parent.parent  # racine du projet
LAUNCHER_DIR = Path(__file__).resolve().parent      # launcher/

# Les 2 lanceurs existants (réutilisés)
LAUNCHER_V1 = ROOT_DIR / "web-mvt" / "launcher" / "app_launcher.py"
LAUNCHER_V2 = ROOT_DIR / "desktop-react" / "launcher" / "app_launcher.py"

# Backend et React
BACKEND_DIR = ROOT_DIR / "backend"
REACT_DIR = ROOT_DIR / "desktop-react" / "ui" / "react-app"
REQUIREMENTS_FILE = BACKEND_DIR / "requirements.txt"

SERVER_HOST = "127.0.0.1"
DJANGO_PORT = 8000
REACT_PORT = 5174


# =====================================================================
#  BRIDGE - Pont JS <-> Python
# =====================================================================
class Bridge(QObject):
    """Le pont entre le JS (unified_ui.html) et le Python"""

    def __init__(self, window):
        super().__init__()
        self.window = window

    @pyqtSlot(str)
    def launchProject(self, project):
        """Appelé depuis le JS quand un bouton est cliqué"""
        self.window.log(f"\n{'=' * 50}")
        self.window.log(f"🚀 Lancement du projet : {project.upper()}")
        self.window.log(f"{'=' * 50}")
        if project == "webmvt":
            self.window.start_web_mvt()
        elif project == "react":
            self.window.show_react_choices()

    @pyqtSlot(str)
    def reactChoice(self, choice):
        """Choix React : 'deploy' (build) ou 'dev' (démarrage direct)"""
        self.window.start_react(choice)

    @pyqtSlot()
    def checkAll(self):
        """Vérification manuelle depuis le bouton 'Vérifier'"""
        self.window.check_dependencies()


# =====================================================================
#  LANCEUR UNIFIÉ
# =====================================================================
class UnifiedLauncher(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Renovate Energy - Unified Launcher")
        self.resize(1100, 750)

        self.server_process = None
        self.react_process = None

        # 1. Navigateur
        self.browser = QWebEngineView()
        self.setCentralWidget(self.browser)

        # 2. Pont JS <-> Python
        self.channel = QWebChannel()
        self.bridge = Bridge(self)
        self.channel.registerObject("bridge", self.bridge)
        self.browser.page().setWebChannel(self.channel)

        # 3. Charger l'UI unifiée
        ui_file = LAUNCHER_DIR / "unified_ui.html"
        self.browser.setUrl(QUrl.fromLocalFile(str(ui_file)))

        # 4. Vérifications initiales
        QTimer.singleShot(1000, self.check_dependencies)

    # ---------------------------------------------------------------
    #  LOG - Envoi des logs vers le JS
    # ---------------------------------------------------------------
    def log(self, message):
        """Affiche un message dans la zone de logs du HTML"""
        import json
        # Échapper correctement pour insérer dans du JS
        msg_json = json.dumps(str(message).replace("\\", "/"))
        js = f"window.appendLog({msg_json});"
        self.browser.page().runJavaScript(js)

    def set_status(self, element, status):
        """Met à jour un indicateur de statut dans le HTML"""
        js = f"window.setStatus('{element}', '{status}');"
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
            self.log("  ❌ node_modules: MISSING → npm install...")
            try:
                subprocess.run(["npm.cmd", "install"], cwd=str(REACT_DIR), shell=True, timeout=120)
                self.log("  ✅ node_modules installé")
                node_ok = True
            except Exception as e:
                self.log(f"  ❌ Échec npm install : {e}")

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

        self.log("\n✅ Vérification des dépendances terminée.")

    # ---------------------------------------------------------------
    #  VÉRIFICATION DU SERVEUR DJANGO
    # ---------------------------------------------------------------
    def is_server_running(self, port=DJANGO_PORT):
        """Teste si le serveur Django est déjà démarré sur le port"""
        try:
            url = f"http://{SERVER_HOST}:{port}/"
            req = urllib.request.Request(url, method="GET")
            with urllib.request.urlopen(req, timeout=2) as resp:
                return resp.status == 200
        except:
            return False

    def find_free_port(self, start_port):
        """Trouve un port libre à partir du port de départ"""
        port = start_port
        while port < start_port + 10:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            result = sock.connect_ex((SERVER_HOST, port))
            sock.close()
            if result != 0:  # port libre
                return port
            port += 1
        return None

    def start_django_if_needed(self):
        """Démarre Django si le serveur n'est pas déjà en ligne"""
        self.log("\n[BACKEND] Vérification du serveur Django...")

        if self.is_server_running(DJANGO_PORT):
            self.log(f"  ✅ Serveur déjà démarré sur :{DJANGO_PORT} — réutilisation")
            self.set_status("server", "ok")
            return DJANGO_PORT, True

        self.log(f"  ⚠️  Serveur non démarré. Démarrage sur :{DJANGO_PORT}...")

        # Démarrer Django
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

        # Polling jusqu'à ce que le serveur réponde
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

        # 1. Vérifier dépendances backend
        self.check_dependencies()

        # 2. Vérifier serveur Django
        port, started = self.start_django_if_needed()
        if not port:
            return

        # 3. Ouvrir navigateur
        self.log(f"\n  🌍 Ouverture du navigateur sur http://{SERVER_HOST}:{port}/dashboard/")
        url = f"http://{SERVER_HOST}:{port}/dashboard/"
        QTimer.singleShot(1000, lambda: self._open_url(url))
        self.log("  ✅ Web MVT lancé !")

    # ---------------------------------------------------------------
    #  LANCEMENT REACT
    # ---------------------------------------------------------------
    def show_react_choices(self):
        """Affiche les 2 choix React dans le HTML"""
        js = "window.showReactChoices();"
        self.browser.page().runJavaScript(js)

    def start_react(self, choice):
        self.log(f"\n⚛️ LANCEMENT REACT (choix : {choice})...")

        # 1. Vérifier dépendances backend + frontend
        self.check_dependencies()

        # 2. Vérifier serveur Django
        port, started = self.start_django_if_needed()
        if not port:
            return

        # 3. Vérifier node_modules
        if not (REACT_DIR / "node_modules").exists():
            self.log("\n  ⚠️  node_modules manquant → npm install...")
            try:
                subprocess.run(["npm.cmd", "install"], cwd=str(REACT_DIR), shell=True, timeout=180)
                self.log("  ✅ node_modules installé")
            except Exception as e:
                self.log(f"  ❌ Échec npm install : {e}")
                return

        # 4. Lancer React selon le choix
        self.log("")
        if choice == "deploy":
            self.log("  📦 MODE DÉPLOIEMENT : build puis preview...")
            try:
                self.log("  ⏳ Compilation (vite build)...")
                subprocess.run(["npm.cmd", "run", "build"], cwd=str(REACT_DIR), shell=True, timeout=120)
                self.log("  ✅ Build terminé !")
                self.react_process = subprocess.Popen(
                    ["npm.cmd", "run", "preview"], cwd=str(REACT_DIR), shell=True
                )
            except Exception as e:
                self.log(f"  ❌ Erreur build : {e}")
                return
        else:
            self.log("  🚀 MODE DÉVELOPPEMENT : démarrage direct...")
            try:
                self.log(f"  ⏳ Démarrage Vite sur :{REACT_PORT}...")
                self.react_process = subprocess.Popen(
                    ["npm.cmd", "run", "dev"], cwd=str(REACT_DIR), shell=True
                )
            except Exception as e:
                self.log(f"  ❌ Erreur démarrage React : {e}")
                return

        # 5. Attendre que le serveur React réponde
        self.log(f"  ⏳ Attente du React sur :{REACT_PORT}...")
        for i in range(20):
            time.sleep(0.5)
            if self.is_server_running(REACT_PORT):
                self.log(f"  ✅ React démarré sur :{REACT_PORT} !")
                break

        # 6. Ouvrir navigateur
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
        # Ne pas tuer les serveurs si on ferme la fenêtre (les UIs continuent)
        event.accept()


# =====================================================================
#  POINT D'ENTRÉE
# =====================================================================
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = UnifiedLauncher()
    window.show()
    sys.exit(app.exec())