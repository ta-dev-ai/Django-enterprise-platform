"""
=====================================================================
LANCEUR UNIFIÉ - Renovate Energy Platform (Architecture Unifiée)
=====================================================================
Serveur HTTP Python léger pilotant l'ensemble de l'écosystème :
- Backend Django (:8000)
- Frontend Web MVT (Django Templates)
- Frontend React (Vite Dev :5174 / Preview Build)

Auteur : Tayierjiang Tayier — Architecte Logiciel Senior
=====================================================================
"""

import os
import sys
import json
import subprocess
import threading
import socket
import webbrowser
import time
import atexit
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse
from urllib import request as urlrequest
from urllib.error import HTTPError, URLError

# --- CONFIGURATION DES CHEMINS ---
ROOT_DIR = Path(__file__).resolve().parent.parent
LAUNCHER_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
REACT_DIR = ROOT_DIR / "desktop-react" / "ui" / "react-app"

SERVER_HOST = "127.0.0.1"
DEFAULT_LAUNCHER_PORT = 5000
DJANGO_PORT = 8000
REACT_DEFAULT_PORT = 5174
CURRENT_LAUNCHER_PORT = DEFAULT_LAUNCHER_PORT
REACT_PORT = REACT_DEFAULT_PORT

PROCESS_LOCK = threading.Lock()
DJANGO_PROCESS = None
REACT_DEV_PROCESS = None
REACT_PREVIEW_PROCESS = None
STATIC_SERVERS = {}


def _terminate_process(process):
    if not process or process.poll() is not None:
        return False
    try:
        if os.name == "nt":
            subprocess.run(["taskkill", "/F", "/T", "/PID", str(process.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            process.terminate()
        return True
    except Exception:
        try:
            process.kill()
            return True
        except Exception:
            return False


def is_port_open(port):
    """Vérifie si une connexion TCP peut être établie sur le port."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.8)
            return s.connect_ex((SERVER_HOST, port)) == 0
    except Exception:
        return False


def is_http_responding(url, timeout=1.5):
    """Vérifie si une URL HTTP renvoie une réponse valide (y compris 302/404/login)."""
    try:
        req = urlrequest.Request(url, headers={"User-Agent": "RenovateLauncher/2.0"})
        with urlrequest.urlopen(req, timeout=timeout) as resp:
            return resp.status in (200, 301, 302, 304, 404)
    except HTTPError as e:
        return e.code in (200, 301, 302, 304, 404)
    except Exception:
        return False


def check_django_health():
    """Vérifie précisément si le serveur Django du backend répond."""
    return is_http_responding(f"http://{SERVER_HOST}:{DJANGO_PORT}/")


def check_react_dev_health():
    """Vérifie si le serveur React Vite répond."""
    return is_port_open(REACT_PORT)


def wait_for_service(check_fn, timeout=15):
    """Attend qu'une fonction de vérification renvoie True."""
    end_time = time.time() + timeout
    while time.time() < end_time:
        if check_fn():
            return True
        time.sleep(0.4)
    return False


def find_free_port(start_port, max_attempts=50):
    """Trouve un port local libre à partir de start_port."""
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex((SERVER_HOST, port)) != 0:
                return port
    return None


class ReactStaticHandler(BaseHTTPRequestHandler):
    """Sert le build React statique et redirige les requêtes API/Django si nécessaire."""

    def do_GET(self):
        if self.path.startswith(("/api/", "/static/", "/login", "/logout", "/contact")):
            self._proxy_to_django()
            return
        relative = urlparse(self.path).path.lstrip("/") or "index.html"
        dist_dir = REACT_DIR / "dist"
        candidate = dist_dir / relative
        if not candidate.is_file():
            candidate = dist_dir / "index.html"
        try:
            content = candidate.read_bytes()
            content_type = "text/html; charset=utf-8" if candidate.suffix == ".html" else (
                "text/javascript" if candidate.suffix == ".js" else (
                    "text/css" if candidate.suffix == ".css" else "application/octet-stream"
                )
            )
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except OSError:
            self.send_error(404, "Fichier non trouvé")

    def _proxy_to_django(self):
        target = f"http://{SERVER_HOST}:{DJANGO_PORT}{self.path}"
        try:
            with urlrequest.urlopen(target, timeout=10) as response:
                content = response.read()
                self.send_response(response.status)
                self.send_header("Content-Type", response.headers.get("Content-Type", "application/octet-stream"))
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
        except HTTPError as error:
            self.send_error(error.code, error.reason)
        except URLError:
            self.send_error(502, "Serveur Django indisponible")

    def log_message(self, format, *args):
        pass


class LauncherHandler(BaseHTTPRequestHandler):
    """Gestionnaire HTTP pour l'interface de contrôle du lanceur."""

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path in ("/", "/index.html"):
            self._serve_file(LAUNCHER_DIR / "simple_ui.html", "text/html; charset=utf-8")
        elif path == "/simple_ui.mjs":
            self._serve_file(LAUNCHER_DIR / "simple_ui.mjs", "text/javascript; charset=utf-8")
        elif path == "/api/status":
            self._send_json(self._get_system_status())
        elif path == "/api/config":
            self._send_json({
                "launcher_port": CURRENT_LAUNCHER_PORT,
                "django_port": DJANGO_PORT,
                "react_port": REACT_PORT,
                "backend_dir": str(BACKEND_DIR),
                "react_dir": str(REACT_DIR),
            })
        elif path == "/api/deploy-info":
            self._send_json(self._check_deploy_info())
        else:
            self.send_error(404, "Ressource introuvable")

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/start-django":
            self._start_django()
        elif path == "/api/stop-django":
            self._stop_django()
        elif path == "/api/start-react-dev":
            self._start_react_dev()
        elif path == "/api/start-react-preview":
            self._start_react_preview()
        elif path == "/api/stop-react":
            self._stop_react()
        elif path == "/api/build-react":
            self._build_react()
        elif path == "/api/stop-all":
            self._stop_all_services()
        elif path == "/api/open-url":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            try:
                data = json.loads(body) if body else {}
                url = data.get("url", "")
                if url:
                    webbrowser.open(url)
                    self._send_json({"success": True, "url": url})
                else:
                    self._send_json({"success": False, "message": "URL manquante"})
            except Exception as e:
                self._send_json({"success": False, "message": str(e)})
        else:
            self.send_error(404, "Action introuvable")

    def _serve_file(self, filepath, content_type):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.end_headers()
            self.wfile.write(content.encode("utf-8"))
        except FileNotFoundError:
            self.send_error(404, f"Fichier non trouvé: {filepath}")

    def _send_json(self, data):
        body = json.dumps(data).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _get_system_status(self):
        django_ok = check_django_health()
        react_dev_ok = check_react_dev_health()
        react_preview_ok = bool(STATIC_SERVERS.get("static"))
        deploy_info = self._check_deploy_info()

        return {
            "django": django_ok,
            "react_dev": react_dev_ok,
            "react_preview": react_preview_ok,
            "node": self._check_node(),
            "python": True,
            "deploy_info": deploy_info,
            "django_port": DJANGO_PORT,
            "react_port": REACT_PORT,
            "launcher_port": CURRENT_LAUNCHER_PORT,
        }

    def _check_node(self):
        try:
            subprocess.check_call(
                ["node", "--version"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            return True
        except Exception:
            return False

    def _check_deploy_info(self):
        import datetime
        dist_dir = REACT_DIR / "dist"
        index_file = dist_dir / "index.html"
        if dist_dir.exists() and index_file.exists():
            mtime = index_file.stat().st_mtime
            date_str = datetime.datetime.fromtimestamp(mtime).strftime("%d/%m/%Y %H:%M")
            return {"exists": True, "date": date_str}
        return {"exists": False, "date": None}

    def _start_django(self):
        global DJANGO_PROCESS
        if check_django_health():
            self._send_json({"success": True, "already_running": True, "message": "Django est déjà en ligne"})
            return

        def run():
            try:
                cmd = [sys.executable, str(BACKEND_DIR / "manage.py"), "runserver", str(DJANGO_PORT)]
                process = subprocess.Popen(
                    cmd,
                    cwd=str(BACKEND_DIR),
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
                )
                with PROCESS_LOCK:
                    DJANGO_PROCESS = process
                wait_for_service(check_django_health, timeout=15)
            except Exception as e:
                print(f"[ERREUR] Échec du lancement Django: {e}")

        threading.Thread(target=run, daemon=True).start()
        self._send_json({"success": True, "message": "Démarrage du serveur Django en cours..."})

    def _stop_django(self):
        global DJANGO_PROCESS
        stopped = False
        with PROCESS_LOCK:
            if DJANGO_PROCESS:
                stopped = _terminate_process(DJANGO_PROCESS)
                DJANGO_PROCESS = None
        self._send_json({"success": True, "stopped": stopped, "message": "Serveur Django arrêté"})

    def _start_react_dev(self):
        global REACT_DEV_PROCESS, REACT_PORT
        if check_react_dev_health():
            self._send_json({"success": True, "already_running": True, "port": REACT_PORT, "message": "React Dev est déjà en ligne"})
            return

        def run():
            try:
                with PROCESS_LOCK:
                    if REACT_DEV_PROCESS and REACT_DEV_PROCESS.poll() is None:
                        _terminate_process(REACT_DEV_PROCESS)
                cmd = ["npm.cmd" if os.name == "nt" else "npm", "run", "dev", "--", "--host", SERVER_HOST, "--port", str(REACT_PORT)]
                process = subprocess.Popen(
                    cmd,
                    cwd=str(REACT_DIR),
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
                )
                with PROCESS_LOCK:
                    REACT_DEV_PROCESS = process
                wait_for_service(check_react_dev_health, timeout=12)
            except Exception as e:
                print(f"[ERREUR] Échec de React Dev: {e}")

        threading.Thread(target=run, daemon=True).start()
        self._send_json({"success": True, "port": REACT_PORT, "message": "Démarrage du serveur React Dev..."})

    def _build_react(self):
        if not REACT_DIR.exists():
            self._send_json({"success": False, "message": "Répertoire React introuvable"})
            return

        cmd = ["npx.cmd" if os.name == "nt" else "npx", "vite", "build"]
        try:
            process = subprocess.Popen(
                cmd,
                cwd=str(REACT_DIR),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
            )
            stdout, stderr = process.communicate()
            dist_dir = REACT_DIR / "dist"
            if process.returncode == 0 and dist_dir.exists():
                deploy_info = self._check_deploy_info()
                self._send_json({"success": True, "message": "Build React terminé avec succès", "date": deploy_info.get("date")})
                return
            err_msg = stderr.decode('utf-8', errors='ignore') or stdout.decode('utf-8', errors='ignore') or f"Code {process.returncode}"
            self._send_json({"success": False, "message": f"Échec du build: {err_msg[:120]}"})
        except Exception as error:
            self._send_json({"success": False, "message": f"Erreur de build: {error}"})

    def _start_react_preview(self):
        global REACT_PORT
        dist_dir = REACT_DIR / "dist"
        if not dist_dir.exists() or not (dist_dir / "index.html").exists():
            self._send_json({"success": False, "message": "Build React requis avant de lancer la preview"})
            return

        def start_static():
            server = ThreadingHTTPServer((SERVER_HOST, REACT_PORT), ReactStaticHandler)
            with PROCESS_LOCK:
                prev = STATIC_SERVERS.get("static")
                if prev:
                    prev.shutdown()
                STATIC_SERVERS["static"] = server
            server.serve_forever()

        threading.Thread(target=start_static, daemon=True).start()
        wait_for_service(lambda: is_port_open(REACT_PORT), timeout=6)
        self._send_json({"success": True, "port": REACT_PORT, "message": "Serveur preview démarré"})

    def _stop_react(self):
        global REACT_DEV_PROCESS
        stopped = False
        with PROCESS_LOCK:
            static_srv = STATIC_SERVERS.pop("static", None)
            if static_srv:
                static_srv.shutdown()
                stopped = True
            if REACT_DEV_PROCESS and REACT_DEV_PROCESS.poll() is None:
                stopped = _terminate_process(REACT_DEV_PROCESS) or stopped
                REACT_DEV_PROCESS = None
        self._send_json({"success": True, "stopped": stopped, "message": "Serveurs React arrêtés"})

    def _stop_all_services(self):
        self._stop_django()
        self._stop_react()
        self._send_json({"success": True, "message": "Tous les sous-services ont été arrêtés"})

    def log_message(self, format, *args):
        pass


def cleanup_on_exit():
    """Nettoyage automatique des sous-processus au moment de quitter."""
    global DJANGO_PROCESS, REACT_DEV_PROCESS
    with PROCESS_LOCK:
        if DJANGO_PROCESS:
            _terminate_process(DJANGO_PROCESS)
        if REACT_DEV_PROCESS:
            _terminate_process(REACT_DEV_PROCESS)
        for s in STATIC_SERVERS.values():
            try:
                s.shutdown()
            except Exception:
                pass


atexit.register(cleanup_on_exit)


def main():
    global CURRENT_LAUNCHER_PORT
    port = find_free_port(DEFAULT_LAUNCHER_PORT)
    if port is None:
        print("[ERREUR] Aucun port disponible pour le lanceur.")
        sys.exit(1)

    CURRENT_LAUNCHER_PORT = port
    server = ThreadingHTTPServer((SERVER_HOST, CURRENT_LAUNCHER_PORT), LauncherHandler)
    url = f"http://{SERVER_HOST}:{CURRENT_LAUNCHER_PORT}"

    print("=" * 60)
    print(f"🚀 LANCEUR UNIFIÉ RENOVATE ENERGY ACTIF")
    print(f"   Portail de contrôle : {url}")
    print(f"   Backend Django     : http://{SERVER_HOST}:{DJANGO_PORT}")
    print(f"   Frontend React     : http://{SERVER_HOST}:{REACT_PORT}")
    print("=" * 60)
    print("Ouverture de l'interface dans votre navigateur...")
    webbrowser.open(url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nArrêt du lanceur...")
        server.shutdown()


if __name__ == "__main__":
    main()
