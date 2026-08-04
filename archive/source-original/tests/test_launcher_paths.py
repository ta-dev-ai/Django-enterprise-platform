import importlib.util
from pathlib import Path


def load_launcher_module():
    repo_root = Path(__file__).resolve().parents[1]
    script_path = repo_root / "app_launcher" / "1_CLIC_DEMARRER_V2.py"
    spec = importlib.util.spec_from_file_location("launcher_v2", script_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_project_root_resolves_to_repo_root():
    module = load_launcher_module()
    repo_root = Path(__file__).resolve().parents[1]

    assert module.get_project_root() == repo_root
