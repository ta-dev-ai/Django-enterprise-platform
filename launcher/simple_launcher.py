"""
=====================================================================
LANCEUR SIMPLE - Version allégée (sans PyQt6)
=====================================================================
Remplace le lanceur PyQt6 par un serveur HTTP Python léger +
interface HTML/JS (ES6 modules / MJS).

Fonctionnalités :
- Interface web simple ouverte dans le navigateur
- Vérifie si Django (:8000) et React (:5174) sont en ligne
- Démarre Django, React dev, React preview
- Ouvre les URLs dans le navigateur par défaut

Auteur : Tayierjiang Tayier — Architecte Logiciel Senior
Date : Avril 2026
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
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse
from urllib import request as urlrequest
from urllib.error import HTTPError, URLError

# --- CONFIGURATION ---
ROOT_DIR = Path(__file__).resolve().parent.parent
LAUNCHER_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
REACT_DIR = ROOT_DIR / "desktop-react" / "ui" / "react-app"

SERVER_HOST = "127.0.0.1"
DJANGO_PORT = 8000
REACT_DEFAULT_PORT = 5174
REACT_PORT = REACT_DEFAULT_PORT
LAUNCHER_PORT = 5000

PROCESS_LOCK = threading.Lock()
DJANGO_PROCESS = None
REACT_PROCESSES = {}
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

def check_port(port):
    """Vérifie si un port est occupé (serveur en ligne)."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1)
            return s.connect_ex((SERVER_HOST, port)) == 0
    except Exception:
        return False


def wait_for_port(port, timeout=15):
    """Attend qu'un port réponde, retourne True/False."""
    for _ in range(int(timeout / 0.5)):
        time.sleep(0.5)
        if check_port(port):
            return True
    return False


def find_available_port(start_port, max_attempts=20):
    for port in range(start_port, start_port + max_attempts):
        if not check_port(port):
            return port
    return None


class ReactStaticHandler(BaseHTTPRequestHandler):
    """Sert le build React et relaie les routes Django nécessaires."""

    def do_GET(self):
        if self.path.startswith(("/api/", "/static/", "/login", "/logout", "/contact")):
            self._proxy_to_django()
            return
        relative = urlparse(self.path).path.lstrip("/") or "index.html"
        candidate = REACT_DIR / "dist" / relative
        if not candidate.is_file():
            candidate = REACT_DIR / "dist" / "index.html"
        try:
            content = candidate.read_bytes()
            content_type = "text/html; charset=utf-8" if candidate.suffix == ".html" else "application/octet-stream"
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except OSError:
            self.send_error(404, "File not found")

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
            self.send_error(502, "Django server unavailable")

    def log_message(self, format, *args):
        pass


class LauncherHandler(BaseHTTPRequestHandler):
    """Gestionnaire HTTP simple pour le lanceur."""

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/" or path == "/index.html":
            self._serve_file(LAUNCHER_DIR / "simple_ui.html", "text/html")
        elif path == "/simple_ui.mjs":
            self._serve_file(LAUNCHER_DIR / "simple_ui.mjs", "text/javascript")
        elif path == "/api/status":
            self._send_json({
                "django": check_port(DJANGO_PORT),
                "react": check_port(REACT_PORT),
                "node": self._check_node(),
                "react_port": REACT_PORT,
            })
        elif path == "/api/config":
            self._send_json({"django_port": DJANGO_PORT, "react_port": REACT_PORT})
        elif path == "/api/deploy-info":
            self._send_json(self._check_deploy_info())
        else:
            self.send_error(404, "Not Found")

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/start-django":
            self._start_django()
        elif path == "/api/start-react-dev":
            self._start_react("dev")
        elif path == "/api/start-react-preview":
            self._start_react("preview")
        elif path == "/api/stop-react":
            self._stop_react()
        elif path == "/api/open-url":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)
            url = data.get("url", "")
            if url:
                opened = webbrowser.open_new_tab(url)
                if not opened:
                    opened = webbrowser.open(url, new=1)
                self._send_json({"success": True, "opened": opened})
            else:
                self._send_json({"success": False, "message": "Missing URL"})
        else:
            self.send_error(404, "Not Found")

    # --- Méthodes utilitaires ---

    def _serve_file(self, filepath, content_type):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.end_headers()
            self.wfile.write(content.encode("utf-8"))
        except FileNotFoundError:
            self.send_error(404, f"File not found: {filepath}")

    def _send_json(self, data):
        body = json.dumps(data).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

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
        """Vérifie si un build React (dist/) existe et retourne la date."""
        import datetime
        dist_dir = REACT_DIR / "dist"
        if dist_dir.exists():
            mtime = dist_dir.stat().st_mtime
            date_str = datetime.datetime.fromtimestamp(mtime).strftime("%d/%m/%Y %H:%M")
            return {"exists": True, "date": date_str}
        return {"exists": False, "date": None}

    def _start_django(self):
        """Démarre le serveur Django dans un thread."""
        global DJANGO_PROCESS
        if check_port(DJANGO_PORT):
            self._send_json({"success": True, "already_running": True, "message": "Django already running"})
            return

        def run():
            try:
                process = subprocess.Popen(
                    [sys.executable, str(BACKEND_DIR / "manage.py"), "runserver", str(DJANGO_PORT)],
                    cwd=str(BACKEND_DIR),
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
                )
                with PROCESS_LOCK:
                    DJANGO_PROCESS = process
                wait_for_port(DJANGO_PORT, timeout=15)
            except Exception as e:
                print(f"[ERROR] Django start failed: {e}")

        threading.Thread(target=run, daemon=True).start()
        self._send_json({"success": True, "message": "Django server starting..."})

    def _start_react(self, mode):
        """D?marre React, avec fallback statique si Vite ne monte pas."""
        global REACT_PORT
        if check_port(REACT_PORT):
            self._send_json({
                "success": True,
                "already_running": True,
                "port": REACT_PORT,
                "message": f"React already running on port {REACT_PORT}",
            })
            return

        selected_port = REACT_PORT
        if check_port(selected_port):
            selected_port = find_available_port(REACT_DEFAULT_PORT + 1)
        if selected_port is None:
            self._send_json({"success": False, "message": "Aucun port React disponible"})
            return
        REACT_PORT = selected_port

        def start_static_fallback():
            server = ThreadingHTTPServer((SERVER_HOST, selected_port), ReactStaticHandler)

            def serve_static():
                server.serve_forever()

            process = threading.Thread(target=serve_static, daemon=True)
            process.start()
            with PROCESS_LOCK:
                previous_server = STATIC_SERVERS.get("static")
                if previous_server:
                    previous_server.shutdown()
                STATIC_SERVERS["static"] = server
            return process

        def run():
            try:
                with PROCESS_LOCK:
                    for key, process in list(REACT_PROCESSES.items()):
                        if key.startswith("react") and process and process.poll() is None:
                            _terminate_process(process)
                            REACT_PROCESSES.pop(key, None)

                cmd = ["npm.cmd", "run", mode, "--", "--host", SERVER_HOST, "--port", str(selected_port)] if os.name == "nt" else ["npm", "run", mode, "--", "--host", SERVER_HOST, "--port", str(selected_port)]
                process = subprocess.Popen(
                    cmd,
                    cwd=str(REACT_DIR),
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
                )
                with PROCESS_LOCK:
                    REACT_PROCESSES[f"react-{mode}"] = process
                ready = wait_for_port(REACT_PORT, timeout=8)
                if ready:
                    return
                _terminate_process(process)
                if (REACT_DIR / "dist").exists():
                    start_static_fallback()
                    wait_for_port(REACT_PORT, timeout=8)
            except Exception as e:
                print(f"[ERROR] React start failed: {e}")
                if (REACT_DIR / "dist").exists():
                    try:
                        start_static_fallback()
                        wait_for_port(REACT_PORT, timeout=8)
                    except Exception as fallback_error:
                        print(f"[ERROR] React fallback failed: {fallback_error}")

        threading.Thread(target=run, daemon=True).start()
        self._send_json({"success": True, "port": selected_port, "message": f"React {mode} server starting..."})

    def _stop_react(self):
        """Arr?te les processus React g?r?s par le lanceur."""
        stopped_any = False
        with PROCESS_LOCK:
            static_server = STATIC_SERVERS.pop("static", None)
            if static_server:
                static_server.shutdown()
                stopped_any = True
            processes = list(REACT_PROCESSES.items())
            for mode, process in processes:
                if process and process.poll() is None:
                    stopped_any = _terminate_process(process) or stopped_any
                REACT_PROCESSES.pop(mode, None)
        self._send_json({"success": True, "stopped": stopped_any})

    def log_message(self, format, *args):
        """Supprime les logs par défaut du serveur HTTP."""
        pass


def main():
    server = ThreadingHTTPServer((SERVER_HOST, LAUNCHER_PORT), LauncherHandler)
    print(f"🚀 Lanceur simple démarré sur http://{SERVER_HOST}:{LAUNCHER_PORT}")
    print(f"   Django : http://{SERVER_HOST}:{DJANGO_PORT}")
    print(f"   React  : http://{SERVER_HOST}:{REACT_PORT}")
    print(f"   Ouverture du navigateur...")
    webbrowser.open(f"http://{SERVER_HOST}:{LAUNCHER_PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Arrêt du lanceur.")
        server.shutdown()


if __name__ == "__main__":
    main()
