import sys
import os
import subprocess
import time
from PyQt6.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget, QMessageBox
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtCore import QUrl, pyqtSlot, QObject, Qt, QTimer
from PyQt6.QtWebChannel import QWebChannel

# --- PATH CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # core/
PROJECT_ROOT = os.path.dirname(BASE_DIR)  # RenovateApp_Launcher/
ENGINE_DIR = os.path.join(PROJECT_ROOT, "engine")
VENV_DIR = os.path.join(ENGINE_DIR, "venv")
UI_DIR = os.path.join(PROJECT_ROOT, "ui")

# Pointeur vers le projet Django (Parent du Launcher)
DJANGO_PROJECT_DIR = os.path.dirname(PROJECT_ROOT)
MANAGE_PY = os.path.join(DJANGO_PROJECT_DIR, "manage.py")

# Python Executable dans le venv (Windows)
VENV_PYTHON = os.path.join(VENV_DIR, "Scripts", "python.exe")


class LauncherBackend(QObject):
    """
    Pont de communication entre le HTML (JS) et Python.
    """

    def __init__(self, parent=None):
        super().__init__(parent)

    @pyqtSlot()
    def launch_django(self):
        """
        Lancé quand l'utilisateur clique sur 'LANCER LE DASHBOARD'
        """
        print("[Launcher] Starting Django Server...")

        # 1. Vérifier si le venv existe
        python_exe = VENV_PYTHON if os.path.exists(VENV_PYTHON) else sys.executable

        if not os.path.exists(MANAGE_PY):
            print(f"[Error] manage.py not found at {MANAGE_PY}")
            return

        try:
            # 2. Lancer le serveur Django dans un processus séparé
            # On utilise Popen pour ne pas bloquer l'interface
            subprocess.Popen(
                [python_exe, MANAGE_PY, "runserver", "8000"],
                cwd=DJANGO_PROJECT_DIR,
                creationflags=subprocess.CREATE_NEW_CONSOLE,  # Ouvre une fenêtre console dédiée (Windows)
            )

            # 3. Ouvrir le navigateur après un court délai
            QTimer.singleShot(2000, lambda: self._open_browser())

        except Exception as e:
            print(f"[Error] Failed to launch: {e}")

    def _open_browser(self):
        import webbrowser

        url = "http://127.0.0.1:8000/dashboard/"

        try:
            # Essayer de trouver Chrome spécifiquement
            chrome_path = None
            # Chemins communs pour Chrome sur Windows
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
                print(f"[Launcher] Chrome found at {chrome_path}")
                webbrowser.register(
                    "chrome", None, webbrowser.BackgroundBrowser(chrome_path)
                )
                webbrowser.get("chrome").open(url)
            else:
                # Fallback sur le navigateur par défaut
                print("[Launcher] Chrome not found, using default browser.")
                webbrowser.open(url)

        except Exception as e:
            print(f"[Launcher] Error opening browser: {e}")
            webbrowser.open(url)

    @pyqtSlot()
    def close_launcher(self):
        QApplication.instance().quit()


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("RenovateEnergy Launcher")
        self.resize(1024, 600)

        # Style Frameless (Sans bordure Windows)
        self.setWindowFlags(Qt.WindowType.FramelessWindowHint)
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)

        # Web Engine Setup
        self.browser = QWebEngineView()
        self.browser.setStyleSheet("background: transparent;")
        self.setCentralWidget(self.browser)

        # Channel (Bridge JS <-> Python)
        self.channel = QWebChannel()
        self.backend = LauncherBackend()
        self.channel.registerObject("backend", self.backend)
        self.browser.page().setWebChannel(self.channel)

        # Chargement de l'UI
        html_file = os.path.join(UI_DIR, "launcher_ui.html")
        self.browser.setUrl(QUrl.fromLocalFile(html_file))


if __name__ == "__main__":
    # Vérification basique des dossiers
    if not os.path.exists(ENGINE_DIR):
        os.makedirs(ENGINE_DIR)

    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
