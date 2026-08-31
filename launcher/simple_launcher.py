"""
=====================================================================
LANCEUR UNIFIÉ - DataPilot Platform (React Static Autonome)
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
UI_DIR = LAUNCHER_DIR / "ui"
BACKEND_DIR = ROOT_DIR / "backend"
REACT_DIR = ROOT_DIR / "desktop-react" / "ui" / "react-app"

SERVER_HOST = "127.0.0.1"
DEFAULT_LAUNCHER_PORT = 5000
DEFAULT_DJANGO_PORT = 8000
DEFAULT_REACT_PORT = 5175

CURRENT_LAUNCHER_PORT = DEFAULT_LAUNCHER_PORT
CURRENT_DJANGO_PORT = DEFAULT_DJANGO_PORT
CURRENT_REACT_PORT = DEFAULT_REACT_PORT

PROCESS_LOCK = threading.Lock()
DJANGO_PROCESS = None
REACT_DEV_PROCESS = None
STATIC_SERVERS = {}


def _terminate_process(process):
    if not process:
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


def _kill_process_on_port(port):
    """Tue de façon garantie le processus écoutant sur un port spécifique (Windows)."""
    if os.name != "nt":
        return False
    try:
        cmd = f'powershell -Command "$p = Get-NetTCPConnection -LocalPort {port} -ErrorAction SilentlyContinue; if ($p) {{ Stop-Process -Id $p.OwningProcess -Force -ErrorAction SilentlyContinue }}"'
        subprocess.run(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except Exception:
        return False


def is_port_open(port):
    """Vérifie si un port TCP est ouvert."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.5)
            return s.connect_ex((SERVER_HOST, port)) == 0
    except Exception:
        return False


def find_free_port(start_port, max_attempts=50):
    """Trouve un port libre."""
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex((SERVER_HOST, port)) != 0:
                return port
    return None


def verify_renovate_django_fingerprint(port):
    """Vérifie si le serveur sur 'port' est le Django Renovate Energy."""
    if not is_port_open(port):
        return False, "offline"
    
    global DJANGO_PROCESS
    with PROCESS_LOCK:
        if DJANGO_PROCESS and DJANGO_PROCESS.poll() is None and CURRENT_DJANGO_PORT == port:
            return True, "our_process"

    try:
        for test_path in ("/", "/login/", "/dashboard/"):
            url = f"http://{SERVER_HOST}:{port}{test_path}"
            req = urlrequest.Request(url, headers={"User-Agent": "RenovateLauncher/3.0"})
            try:
                with urlrequest.urlopen(req, timeout=1.2) as resp:
                    body = resp.read(4096).decode('utf-8', errors='ignore')
                    headers_str = str(resp.headers).lower()
                    if '{"detail":"not found"}' in body.lower():
                        return False, "external_fastapi"
                    if "renovate" in body.lower() or "csrftoken" in headers_str or "sessionid" in headers_str:
                        return True, "renovate_active"
            except HTTPError as http_err:
                body = http_err.read(1024).decode('utf-8', errors='ignore')
                if '{"detail":"not found"}' in body.lower():
                    return False, "external_fastapi"
                if http_err.code in (301, 302) and "login" in http_err.headers.get("Location", "").lower():
                    return True, "renovate_active"
    except Exception:
        pass

    return False, "external_unknown"


def verify_renovate_react_fingerprint(port):
    """Vérifie si le port React est ouvert et actif."""
    if not is_port_open(port):
        return False, "offline"
    global REACT_DEV_PROCESS
    with PROCESS_LOCK:
        if REACT_DEV_PROCESS and REACT_DEV_PROCESS.poll() is None and CURRENT_REACT_PORT == port:
            return True, "our_process"
        if STATIC_SERVERS.get("static") and CURRENT_REACT_PORT == port:
            return True, "our_preview"
    
    try:
        url = f"http://{SERVER_HOST}:{port}/"
        with urlrequest.urlopen(url, timeout=1.0) as resp:
            content = resp.read(2048).decode('utf-8', errors='ignore')
            if "vite" in content.lower() or "react" in content.lower() or "renovate" in content.lower():
                return True, "running"
    except Exception:
        pass

    return False, "external_unknown"


def wait_for_check(check_fn, timeout=15):
    end_time = time.time() + timeout
    while time.time() < end_time:
        if check_fn():
            return True
        time.sleep(0.4)
    return False


class ReactStaticHandler(BaseHTTPRequestHandler):
    """Sert le build React statique de façon 100% autonome et relaie les requêtes API vers Django."""

    MIME_TYPES = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".ico": "image/x-icon",
        ".ttf": "font/ttf",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
    }

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        dist_dir = REACT_DIR / "dist"
        relative = path.lstrip("/") or "index.html"
        candidate = dist_dir / relative

        # Si un fichier statique ou JSON de données local existe dans dist, on le sert directement
        if candidate.is_file():
            try:
                content = candidate.read_bytes()
                suffix = candidate.suffix.lower()
                content_type = self.MIME_TYPES.get(suffix, "application/octet-stream")
                self.send_response(200)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", str(len(content)))
                self.send_header("Cache-Control", "public, max-age=3600")
                self.end_headers()
                self.wfile.write(content)
                return
            except OSError:
                pass

        # 2. Requêtes dynamiques API / Auth -> proxy vers Django
        if path.startswith(("/api/", "/login/", "/logout/", "/contact/")):
            self._proxy_to_django()
            return

        # Fallback pour le routage SPA React
        if not relative.startswith("assets/") and not relative.startswith("static/") and not relative.startswith("api/"):
            index_candidate = dist_dir / "index.html"
            if index_candidate.is_file():
                try:
                    content = index_candidate.read_bytes()
                    self.send_response(200)
                    self.send_header("Content-Type", "text/html; charset=utf-8")
                    self.send_header("Content-Length", str(len(content)))
                    self.end_headers()
                    self.wfile.write(content)
                    return
                except OSError:
                    pass

        self.send_error(404, "Fichier non trouvé")

    def _proxy_to_django(self):
        target = f"http://{SERVER_HOST}:{CURRENT_DJANGO_PORT}{self.path}"
        try:
            with urlrequest.urlopen(target, timeout=8) as response:
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


class ModularLauncherHandler(BaseHTTPRequestHandler):
    """Gestionnaire HTTP servant les fichiers modulaires du lanceur et l'API REST."""

    MIME_TYPES = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".mjs": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".ico": "image/x-icon",
        ".ttf": "font/ttf",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
    }

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/status":
            self._send_json(self._get_full_status())
            return
        elif path == "/api/deploy-info":
            self._send_json(self._check_deploy_info())
            return

        if path in ("/", "/index.html"):
            self._serve_static_file(UI_DIR / "index.html")
            return

        relative_path = path.lstrip("/")
        target_file = UI_DIR / relative_path

        if not target_file.is_file():
            fallback = LAUNCHER_DIR / relative_path
            if fallback.is_file():
                target_file = fallback

        if target_file.is_file():
            self._serve_static_file(target_file)
        else:
            self.send_error(404, f"Fichier introuvable: {path}")

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/start-django":
            self._start_django()
        elif path == "/api/stop-django":
            self._stop_django()
        elif path == "/api/start-react-dev":
            self._start_react_dev()
        elif path == "/api/build-react":
            self._build_react()
        elif path == "/api/start-react-preview":
            self._start_react_preview()
        elif path == "/api/stop-react":
            self._stop_react()
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
                    self._send_json({"success": False, "message": "URL absente"})
            except Exception as e:
                self._send_json({"success": False, "message": str(e)})
        else:
            self.send_error(404, "Action non trouvée")

    def _serve_static_file(self, filepath):
        try:
            content = Path(filepath).read_bytes()
            suffix = Path(filepath).suffix.lower()
            content_type = self.MIME_TYPES.get(suffix, "application/octet-stream")
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Cache-Control", "no-cache, must-revalidate")
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, f"Erreur de lecture: {e}")

    def _send_json(self, data):
        body = json.dumps(data).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(body)

    def _check_deploy_info(self):
        import datetime
        dist_dir = REACT_DIR / "dist"
        index_file = dist_dir / "index.html"
        if dist_dir.exists() and index_file.exists():
            mtime = index_file.stat().st_mtime
            date_str = datetime.datetime.fromtimestamp(mtime).strftime("%d/%m/%Y %H:%M")
            return {"exists": True, "date": date_str}
        return {"exists": False, "date": None}

    def _get_full_status(self):
        global CURRENT_DJANGO_PORT, CURRENT_REACT_PORT
        
        django_is_renovate, django_state = verify_renovate_django_fingerprint(CURRENT_DJANGO_PORT)
        react_is_renovate, react_state = verify_renovate_react_fingerprint(CURRENT_REACT_PORT)
        react_preview_running = bool(STATIC_SERVERS.get("static"))

        has_node = False
        try:
            subprocess.check_call(["node", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            has_node = True
        except Exception:
            pass

        return {
            "django_online": django_is_renovate,
            "django_state": django_state,
            "django_port": CURRENT_DJANGO_PORT,
            "react_dev_online": react_is_renovate and (react_state == "our_process" or (is_port_open(CURRENT_REACT_PORT) and not react_preview_running)),
            "react_preview_online": react_preview_running,
            "react_port": CURRENT_REACT_PORT,
            "node_available": has_node,
            "deploy_info": self._check_deploy_info(),
            "launcher_port": CURRENT_LAUNCHER_PORT,
        }

    def _start_django(self):
        global DJANGO_PROCESS, CURRENT_DJANGO_PORT
        
        is_renovate, _ = verify_renovate_django_fingerprint(CURRENT_DJANGO_PORT)
        if is_renovate:
            self._send_json({
                "success": True,
                "already_running": True,
                "port": CURRENT_DJANGO_PORT,
                "message": f"Django Renovate Energy est déjà actif sur le port {CURRENT_DJANGO_PORT}"
            })
            return

        if is_port_open(CURRENT_DJANGO_PORT) and not is_renovate:
            free_port = find_free_port(DEFAULT_DJANGO_PORT + 1)
            if free_port:
                CURRENT_DJANGO_PORT = free_port

        def run():
            try:
                cmd = [sys.executable, str(BACKEND_DIR / "manage.py"), "runserver", str(CURRENT_DJANGO_PORT)]
                process = subprocess.Popen(
                    cmd,
                    cwd=str(BACKEND_DIR),
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
                )
                with PROCESS_LOCK:
                    DJANGO_PROCESS = process
                wait_for_check(lambda: verify_renovate_django_fingerprint(CURRENT_DJANGO_PORT)[0], timeout=15)
            except Exception as e:
                print(f"[ERREUR] Échec du lancement Django: {e}")

        threading.Thread(target=run, daemon=True).start()
        self._send_json({"success": True, "port": CURRENT_DJANGO_PORT, "message": f"Démarrage de Django sur le port {CURRENT_DJANGO_PORT}..."})

    def _stop_django(self):
        global DJANGO_PROCESS, CURRENT_DJANGO_PORT
        stopped = False
        with PROCESS_LOCK:
            if DJANGO_PROCESS:
                stopped = _terminate_process(DJANGO_PROCESS)
                DJANGO_PROCESS = None
        if CURRENT_DJANGO_PORT != DEFAULT_DJANGO_PORT and is_port_open(CURRENT_DJANGO_PORT):
            _kill_process_on_port(CURRENT_DJANGO_PORT)
            stopped = True
        self._send_json({"success": True, "stopped": stopped, "message": "Serveur Django arrêté"})

    def _start_react_dev(self):
        global REACT_DEV_PROCESS, CURRENT_REACT_PORT
        
        if is_port_open(CURRENT_REACT_PORT):
            is_our, _ = verify_renovate_react_fingerprint(CURRENT_REACT_PORT)
            if is_our and REACT_DEV_PROCESS and REACT_DEV_PROCESS.poll() is None:
                self._send_json({
                    "success": True,
                    "already_running": True,
                    "port": CURRENT_REACT_PORT,
                    "message": f"React Dev est déjà actif sur le port {CURRENT_REACT_PORT}"
                })
                return
            free_port = find_free_port(DEFAULT_REACT_PORT + 1)
            if free_port:
                CURRENT_REACT_PORT = free_port

        def run():
            try:
                with PROCESS_LOCK:
                    if REACT_DEV_PROCESS and REACT_DEV_PROCESS.poll() is None:
                        _terminate_process(REACT_DEV_PROCESS)
                env = os.environ.copy()
                env["DJANGO_PORT"] = str(CURRENT_DJANGO_PORT)
                cmd = ["npm.cmd" if os.name == "nt" else "npm", "run", "dev", "--", "--host", SERVER_HOST, "--port", str(CURRENT_REACT_PORT)]
                process = subprocess.Popen(
                    cmd,
                    cwd=str(REACT_DIR),
                    env=env,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
                )
                with PROCESS_LOCK:
                    REACT_DEV_PROCESS = process
                wait_for_check(lambda: is_port_open(CURRENT_REACT_PORT), timeout=12)
            except Exception as e:
                print(f"[ERREUR] Échec de React Dev: {e}")

        threading.Thread(target=run, daemon=True).start()
        self._send_json({"success": True, "port": CURRENT_REACT_PORT, "message": f"Démarrage de React Dev sur le port {CURRENT_REACT_PORT}..."})

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
                self._send_json({"success": True, "message": "Déploiement React compilé avec succès", "date": deploy_info.get("date")})
                return
            err_msg = stderr.decode('utf-8', errors='ignore') or stdout.decode('utf-8', errors='ignore') or f"Code {process.returncode}"
            self._send_json({"success": False, "message": f"Échec du build: {err_msg[:120]}"})
        except Exception as error:
            self._send_json({"success": False, "message": f"Erreur de build: {error}"})

    def _start_react_preview(self):
        global CURRENT_REACT_PORT
        dist_dir = REACT_DIR / "dist"
        if not dist_dir.exists() or not (dist_dir / "index.html").exists():
            self._send_json({"success": False, "message": "Aucun build trouvé. Veuillez d'abord cliquer sur 'Déployer'."})
            return

        if is_port_open(CURRENT_REACT_PORT) and not STATIC_SERVERS.get("static"):
            free_port = find_free_port(DEFAULT_REACT_PORT + 1)
            if free_port:
                CURRENT_REACT_PORT = free_port

        def start_static():
            server = ThreadingHTTPServer((SERVER_HOST, CURRENT_REACT_PORT), ReactStaticHandler)
            with PROCESS_LOCK:
                prev = STATIC_SERVERS.get("static")
                if prev:
                    prev.shutdown()
                STATIC_SERVERS["static"] = server
            server.serve_forever()

        threading.Thread(target=start_static, daemon=True).start()
        wait_for_check(lambda: is_port_open(CURRENT_REACT_PORT), timeout=6)
        self._send_json({"success": True, "port": CURRENT_REACT_PORT, "message": f"Serveur Preview actif sur le port {CURRENT_REACT_PORT}"})

    def _stop_react(self):
        global REACT_DEV_PROCESS, CURRENT_REACT_PORT
        stopped = False
        with PROCESS_LOCK:
            static_srv = STATIC_SERVERS.pop("static", None)
            if static_srv:
                static_srv.shutdown()
                stopped = True
            if REACT_DEV_PROCESS and REACT_DEV_PROCESS.poll() is None:
                stopped = _terminate_process(REACT_DEV_PROCESS) or stopped
                REACT_DEV_PROCESS = None
        if is_port_open(CURRENT_REACT_PORT):
            _kill_process_on_port(CURRENT_REACT_PORT)
            stopped = True
        self._send_json({"success": True, "stopped": stopped, "message": "Processus React arrêtés"})

    def log_message(self, format, *args):
        pass


def cleanup_all():
    global DJANGO_PROCESS, REACT_DEV_PROCESS, CURRENT_DJANGO_PORT, CURRENT_REACT_PORT
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


atexit.register(cleanup_all)


def main():
    global CURRENT_LAUNCHER_PORT
    port = find_free_port(DEFAULT_LAUNCHER_PORT)
    if port is None:
        print("[ERREUR] Aucun port disponible pour le lanceur.")
        sys.exit(1)

    CURRENT_LAUNCHER_PORT = port
    server = ThreadingHTTPServer((SERVER_HOST, CURRENT_LAUNCHER_PORT), ModularLauncherHandler)
    url = f"http://{SERVER_HOST}:{CURRENT_LAUNCHER_PORT}"

    print("=" * 65)
    print(f"🌿 RENOVATE ENERGY - PORTAIL DE SUPERVISION MODULAIRE")
    print(f"   Interface Web   : {url}")
    print(f"   Dossier UI      : {UI_DIR}")
    print("=" * 65)
    webbrowser.open(url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nArrêt du lanceur...")
        server.shutdown()


if __name__ == "__main__":
    main()
