import sys
import os
import subprocess
import time
import socket
from PyQt6.QtWidgets import QApplication, QMainWindow
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtCore import QUrl, QTimer, pyqtSlot, QObject
from PyQt6.QtWebChannel import QWebChannel

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # RenovateApp_Launcher/
PROJECT_ROOT = os.path.dirname(BASE_DIR)  # batiment-renovation-paris-monta - Copie/
ENGINE_DIR = os.path.join(BASE_DIR, "engine")
VENV_PYTHON = os.path.join(ENGINE_DIR, "venv", "Scripts", "python.exe")
MANAGE_PY = os.path.join(PROJECT_ROOT, "manage.py")
UI_DIR = os.path.join(BASE_DIR, "ui")

SERVER_HOST = "127.0.0.1"
SERVER_PORT = "8000"
DASHBOARD_URL = f"http://{SERVER_HOST}:{SERVER_PORT}/dashboard/"


class RenovateApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Renovate Energy - Launcher")
        self.resize(1000, 700)

        # 1. Setup Navigateur
        self.browser = QWebEngineView()
        self.browser.setStyleSheet("background-color: #0f172a;")
        self.setCentralWidget(self.browser)

        # 2. Interception du signal "LANCER" via URL (Plus robuste que JS Bridge)
        self.browser.urlChanged.connect(self.check_trigger)

        # 3. Charger l'UI Locale
        loading_html = os.path.join(UI_DIR, "launcher_ui.html")
        self.browser.setUrl(QUrl.fromLocalFile(loading_html))

    def check_trigger(self, url):
        """Détecte quand l'utilisateur clique sur le bouton (via changement d'URL)"""
        url_str = url.toString()
        if "launch-now" in url_str:
            print("[LAUNCHER] Signal de lancement reçu via URL.")
            self.start_process()

    def start_process(self):
        """Lance Django et le timer de vérification"""
        self.start_django_server()

        # Timer pour vérifier si le serveur répond
        self.check_server_timer = QTimer()
        self.check_server_timer.timeout.connect(self.check_server_ready)
        self.check_server_timer.start(500)  # 500ms

    def start_django_server(self):
        if not os.path.exists(MANAGE_PY):
            print(f"[ERREUR] manage.py introuvable : {MANAGE_PY}")
            return

        # Choix Python (Portable ou Système)
        python_exe = VENV_PYTHON if os.path.exists(VENV_PYTHON) else sys.executable

        # Validation du Python choisi
        try:
            subprocess.check_call(
                [python_exe, "-c", "import django"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                creationflags=(
                    0 if sys.platform != "win32" else subprocess.CREATE_NO_WINDOW
                ),
            )
        except:
            print(f"[RENOVATE] Fallback sur Python Système ({sys.executable})")
            python_exe = sys.executable

        print(f"[RENOVATE] Démarrage serveur avec : {python_exe}")

        creation_flags = 0
        if sys.platform == "win32":
            creation_flags = subprocess.CREATE_NO_WINDOW

        self.server_process = subprocess.Popen(
            [python_exe, MANAGE_PY, "runserver", SERVER_PORT],
            cwd=PROJECT_ROOT,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            creationflags=creation_flags,
        )

    def check_server_ready(self):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex((SERVER_HOST, int(SERVER_PORT)))
        sock.close()

        if result == 0:
            print("[RENOVATE] Serveur prêt ! Ouverture Chrome...")
            self.check_server_timer.stop()

            # Ouvrir Chrome
            import webbrowser

            chrome_path = None
            paths = [
                r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
                os.path.expanduser(
                    r"~\AppData\Local\Google\Chrome\Application\chrome.exe"
                ),
            ]
            for path in paths:
                if os.path.exists(path):
                    chrome_path = path
                    break

            target_url = DASHBOARD_URL
            if chrome_path:
                webbrowser.register(
                    "chrome", None, webbrowser.BackgroundBrowser(chrome_path)
                )
                webbrowser.get("chrome").open(target_url)
            else:
                webbrowser.open(target_url)

            # Fermer le launcher après ouverture
            QTimer.singleShot(1000, self.close)  # Petit délai pour être propre
        else:
            print("[RENOVATE] Attente serveur...")

    def closeEvent(self, event):
        # On ne tue PAS le serveur si l'utilisateur ferme la fenêtre après lancement
        # Mais si on ferme AVANT le lancement complet, on pourrait vouloir tuer.
        # Ici on laisse le serveur tourner pour que Chrome puisse l'utiliser.
        event.accept()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = RenovateApp()
    window.show()
    sys.exit(app.exec())
