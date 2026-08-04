import importlib.util
from pathlib import Path


def load_launcher_module():
    # Dans la structure multi-repo, le launcher V2 est dans desktop-react/
    backend_root = Path(__file__).resolve().parents[1]  # backend/
    multi_repo_root = backend_root.parent  # multi-repo-target/
    script_path = multi_repo_root / "desktop-react" / "launcher" / "app_launcher.py"
    spec = importlib.util.spec_from_file_location("launcher_v2", script_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_project_root_resolves_to_repo_root():
    module = load_launcher_module()
    backend_root = Path(__file__).resolve().parents[1]  # backend/
    multi_repo_root = backend_root.parent  # multi-repo-target/

    # Le launcher V2 pointe vers backend/manage.py
    assert module.MANAGE_PY == str(multi_repo_root / "backend" / "manage.py")
