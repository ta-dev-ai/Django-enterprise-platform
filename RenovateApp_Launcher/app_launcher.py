import sys
import os
import subprocess
import time
import socket
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QWidget
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtCore import QUrl, QTimer, Qt

# --- CONFIGURATION (Relatif à app_launcher.py à la racine de RenovateApp_Launcher/) ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # RenovateApp_Launcher/
PROJECT_ROOT = os.path.dirname(BASE_DIR)  # batiment-renovation-paris-monta - Copie/
ENGINE_DIR = os.path.join(BASE_DIR, "engine")
VENV_PYTHON = os.path.join(ENGINE_DIR, "venv", "Scripts", "python.exe")
MANAGE_PY = os.path.join(PROJECT_ROOT, "manage.py")
UI_DIR = os.path.join(BASE_DIR, "ui")

SERVER_Host = "127.0.0.1"
SERVER_PORT = "8000"
DASHBOARD_URL = f"http://{SERVER_Host}:{SERVER_PORT}/dashboard/"


class RenovateApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Renovate Energy - Dashboard")
        self.resize(1280, 800)

        # Style de la fenêtre (Optionnel: Frameless pour un look app moderne)
        # self.setWindowFlags(Qt.WindowType.FramelessWindowHint)

        # Widget Central : Navigateur Web
        self.browser = QWebEngineView()
        self.browser.setStyleSheet("background-color: #0f172a;")  # Match theme color
        set_central = self.setCentralWidget(self.browser)

        # 1. Charger l'écran de chargement (UI locale)
        loading_html = os.path.join(UI_DIR, "launcher_ui.html")
        self.browser.setUrl(QUrl.fromLocalFile(loading_html))

        # 2. Démarrer Django en arrière-plan
        self.start_django_server()

        # 3. Vérifier périodiquement si le serveur est prêt
        self.check_server_timer = QTimer()
        self.check_server_timer.timeout.connect(self.check_server_ready)
        self.check_server_timer.start(500)  # Vérifie toutes les 500ms

    def start_django_server(self):
        """Lance le serveur Django avec le python du venv portable."""
        if not os.path.exists(MANAGE_PY):
            print(f"[ERREUR] manage.py introuvable : {MANAGE_PY}")
            return

        # On utilise le python du venv s'il existe, sinon le système (dev mode)
        python_exe = VENV_PYTHON if os.path.exists(VENV_PYTHON) else sys.executable

        # On vérifie si ce python peut vraiment lancer Django
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
            print(
                f"[RENOVATE] Le Venv est incomplet. Basculement sur le Python Système ({sys.executable})..."
            )
            python_exe = sys.executable

        print(f"[RENOVATE] Lancement du serveur avec : {python_exe}")

        # Lancement du processus sans fenêtre (creationflags=CREATE_NO_WINDOW pour Windows)
        creation_flags = 0
        if sys.platform == "win32":
            creation_flags = subprocess.CREATE_NO_WINDOW

        self.server_process = subprocess.Popen(
            [python_exe, MANAGE_PY, "runserver", SERVER_PORT],
            cwd=PROJECT_ROOT,
            stdout=subprocess.DEVNULL,  # Silence stdout
            stderr=subprocess.DEVNULL,  # Silence stderr
            creationflags=creation_flags,
        )

    def check_server_ready(self):
        """Vérifie si le port 8000 répond."""
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex((SERVER_Host, int(SERVER_PORT)))
        sock.close()

        if result == 0:
            print("[RENOVATE] Serveur prêt ! Ouverture de Chrome...")
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

            if chrome_path:
                webbrowser.register(
                    "chrome", None, webbrowser.BackgroundBrowser(chrome_path)
                )
                webbrowser.get("chrome").open(DASHBOARD_URL)
            else:
                webbrowser.open(DASHBOARD_URL)

            # Fermer le launcher
            self.close()
        else:
            print("[RENOVATE] En attente du serveur...")

    def closeEvent(self, event):
        """Arrête le serveur Django quand on ferme la fenêtre."""
        if hasattr(self, "server_process"):
            self.server_process.terminate()
        event.accept()


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = RenovateApp()
    window.show()
    sys.exit(app.exec())
