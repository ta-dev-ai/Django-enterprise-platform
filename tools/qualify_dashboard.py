"""Audit ciblé Dashboard React via QualificationEngine (DTOs + export).

Usage (depuis la racine du projet) :
    python tools/qualify_dashboard.py
"""

from __future__ import annotations

import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from tools.qualification_engine.core.engine import QualificationEngine  # noqa: E402
from tools.qualification_engine.domain.models import (  # noqa: E402
    EcosystemSummaryDTO,
    QualityReportDTO,
    QualityViolationDTO,
)

REACT_ROOT = PROJECT_ROOT / "desktop-react" / "ui" / "react-app"

DASHBOARD_TARGETS = [
    REACT_ROOT / "src" / "pages" / "DashboardPage.jsx",
    REACT_ROOT / "src" / "sections" / "common" / "SidebarSection.jsx",
    REACT_ROOT / "src" / "sections" / "dashboard" / "OverviewSection.jsx",
    REACT_ROOT / "src" / "sections" / "dashboard" / "BatimentSectionPanel.jsx",
    REACT_ROOT / "src" / "App.jsx",
]


def _violation(
    *,
    file: Path,
    line: int,
    rule: str,
    message: str,
    action: str,
    severity: str = "ERROR",
) -> QualityViolationDTO:
    rel = str(file.relative_to(PROJECT_ROOT)).replace("\\", "/")
    snippet = ""
    try:
        lines = file.read_text(encoding="utf-8").splitlines()
        if 1 <= line <= len(lines):
            snippet = lines[line - 1].strip()
    except OSError:
        pass
    return QualityViolationDTO(
        ecosystem="typescript",
        tool_origin="qualify_dashboard",
        file=rel,
        line=line,
        column=1,
        code_snippet=snippet,
        rule=rule,
        message=message,
        severity=severity,
        ai_actionable_fix=action,
    )


def _find_line(text: str, pattern: str) -> int:
    for i, line in enumerate(text.splitlines(), start=1):
        if re.search(pattern, line):
            return i
    return 1


def scan_dashboard_rules() -> tuple[EcosystemSummaryDTO, list[QualityViolationDTO]]:
    """Règles métier : Vue d'ensemble ≠ Bâtiments + sync sidebar/route."""
    start = time.time()
    violations: list[QualityViolationDTO] = []

    for path in DASHBOARD_TARGETS:
        if not path.exists():
            violations.append(
                _violation(
                    file=path,
                    line=1,
                    rule="dashboard/missing-file",
                    message=f"Fichier requis absent: {path.name}",
                    action=f"Restaurer ou créer {path.name}.",
                )
            )

    dash = REACT_ROOT / "src" / "pages" / "DashboardPage.jsx"
    if dash.exists():
        text = dash.read_text(encoding="utf-8")
        if "OverviewSection" not in text:
            violations.append(
                _violation(
                    file=dash,
                    line=1,
                    rule="dashboard/overview-not-wired",
                    message="OverviewSection n'est pas importé/branché dans DashboardPage.",
                    action="Importer OverviewSection et l'afficher quand view === 'all'.",
                )
            )
        # Fuite classique: (view === 'all' || view === 'batiment')
        if re.search(r"view\s*===\s*['\"]all['\"]\s*\|\|\s*view\s*===\s*['\"]batiment['\"]", text):
            violations.append(
                _violation(
                    file=dash,
                    line=_find_line(text, r"view\s*===\s*['\"]all['\"]\s*\|\|"),
                    rule="dashboard/shared-panel-condition",
                    message="Condition partagée all||batiment : la vue globale réaffiche le panel bâtiments.",
                    action="Séparer les conditions: view==='all' → Overview ; view==='batiment' → BatimentSectionPanel.",
                )
            )
        elif "BatimentSectionPanel" in text and not re.search(
            r"view\s*===\s*['\"]batiment['\"]\s*&&\s*<BatimentSectionPanel",
            text,
        ):
            violations.append(
                _violation(
                    file=dash,
                    line=_find_line(text, r"BatimentSectionPanel"),
                    rule="dashboard/overview-leaks-batiment",
                    message="BatimentSectionPanel n'est pas strictement limité à view === 'batiment'.",
                    action="Utiliser uniquement: view === 'batiment' && <BatimentSectionPanel ... />.",
                )
            )

    sidebar = REACT_ROOT / "src" / "sections" / "common" / "SidebarSection.jsx"
    if sidebar.exists():
        text = sidebar.read_text(encoding="utf-8")
        if "useEffect" not in text or "setOpenSections" not in text:
            violations.append(
                _violation(
                    file=sidebar,
                    line=1,
                    rule="sidebar/no-route-sync",
                    message="openSections n'est pas synchronisé avec la route.",
                    action="Ajouter un useEffect([route]) qui ouvre/ferme les accordéons selon pathname.",
                )
            )
        # Clic Vue d'ensemble doit fermer les accordéons (setOpenSections false)
        overview_click = re.search(
            r"handleNav\(['\"]\/dashboard['\"]\)",
            text,
        )
        if overview_click and "batiment: false" not in text:
            violations.append(
                _violation(
                    file=sidebar,
                    line=_find_line(text, r"\/dashboard"),
                    rule="sidebar/overview-keeps-accordion",
                    message="Navigation Vue d'ensemble ne ferme pas explicitement les accordéons.",
                    action="Sur clic Vue d'ensemble: setOpenSections({batiment:false, types:false, dpe:false}).",
                )
            )

    app = REACT_ROOT / "src" / "App.jsx"
    if app.exists():
        text = app.read_text(encoding="utf-8")
        for route, view in (("/dashboard", "all"), ("/batiment", "batiment")):
            if f'path="{route}"' not in text and f"path='{route}'" not in text:
                violations.append(
                    _violation(
                        file=app,
                        line=_find_line(text, "Route"),
                        rule="dashboard/missing-route",
                        message=f"Route {route} absente dans App.jsx.",
                        action=f'Ajouter <Route path="{route}" element={{<DashboardPage view="{view}" />}} />.',
                    )
                )

    # Parse JSX-ish as text only — skip AST (JSX not valid Python)
    duration = round(time.time() - start, 2)
    passed = len(violations) == 0
    score = 10.0 if passed else max(0.0, round(10.0 - 1.5 * len(violations), 1))
    summary = EcosystemSummaryDTO(
        ecosystem="dashboard_react_rules",
        passed=passed,
        score=score,
        violations_count=len(violations),
        execution_time_s=duration,
    )
    return summary, violations


def scan_vite_build() -> tuple[EcosystemSummaryDTO, list[QualityViolationDTO]]:
    """Smoke test build Vite (équivalent pilier 'tests' du moteur TS)."""
    start = time.time()
    violations: list[QualityViolationDTO] = []
    if not (REACT_ROOT / "package.json").exists():
        violations.append(
            _violation(
                file=REACT_ROOT / "package.json",
                line=1,
                rule="vite/missing-package",
                message="package.json react-app introuvable.",
                action="Vérifier le chemin desktop-react/ui/react-app.",
            )
        )
        return (
            EcosystemSummaryDTO(
                ecosystem="vite_build",
                passed=False,
                score=0.0,
                violations_count=1,
                execution_time_s=round(time.time() - start, 2),
            ),
            violations,
        )

    res = subprocess.run(
        ["npm", "run", "build"],
        cwd=REACT_ROOT,
        capture_output=True,
        text=True,
        shell=True,
        check=False,
    )
    if res.returncode != 0:
        tail = (res.stdout + "\n" + res.stderr)[-1200:]
        violations.append(
            QualityViolationDTO(
                ecosystem="typescript",
                tool_origin="vite",
                file="desktop-react/ui/react-app",
                line=1,
                column=1,
                code_snippet="",
                rule="vite/build-failed",
                message="npm run build a échoué.",
                severity="ERROR",
                ai_actionable_fix=f"Corriger les erreurs de build Vite.\n---\n{tail}",
            )
        )

    duration = round(time.time() - start, 2)
    passed = len(violations) == 0
    summary = EcosystemSummaryDTO(
        ecosystem="vite_build",
        passed=passed,
        score=10.0 if passed else 4.0,
        violations_count=len(violations),
        execution_time_s=duration,
    )
    return summary, violations


def main() -> int:
    print("==================================================================")
    print(" SNORBK — QUALIFY DASHBOARD (QualificationEngine)")
    print("==================================================================")
    t0 = time.time()

    ecosystems: list[EcosystemSummaryDTO] = []
    all_violations: list[QualityViolationDTO] = []

    rules_summary, rules_v = scan_dashboard_rules()
    ecosystems.append(rules_summary)
    all_violations.extend(rules_v)

    build_summary, build_v = scan_vite_build()
    ecosystems.append(build_summary)
    all_violations.extend(build_v)

    # Markup scanner du moteur, scopé sur react-app (chemins CSS locaux adaptés via root)
    markup_summary, markup_v = QualificationEngine(REACT_ROOT).markup_scanner.scan()
    ecosystems.append(markup_summary)
    all_violations.extend(markup_v)

    for v in all_violations:
        v.file = v.file.replace("\\", "/")

    global_passed = all(e.passed for e in ecosystems)
    avg_score = round(sum(e.score for e in ecosystems) / len(ecosystems), 2)
    report = QualityReportDTO(
        timestamp=datetime.now(timezone.utc).isoformat(),
        global_passed=global_passed,
        global_score=avg_score,
        total_violations=len(all_violations),
        ecosystems=ecosystems,
        violations=all_violations,
        metadata={
            "project_root": str(PROJECT_ROOT).replace("\\", "/"),
            "react_root": str(REACT_ROOT).replace("\\", "/"),
            "mode": "dashboard_targeted",
            "targets": [str(p.relative_to(PROJECT_ROOT)).replace("\\", "/") for p in DASHBOARD_TARGETS],
        },
    )

    # Réutilise l'export du moteur (écrit audit_report.* à la racine)
    QualificationEngine(PROJECT_ROOT)._export_reports(report)

    duration = round(time.time() - t0, 2)
    print(f" Score Global : {report.global_score} / 10.0")
    print(f" Duree        : {duration}s")
    print(f" Violations   : {report.total_violations}")
    for eco in ecosystems:
        status = "OK" if eco.passed else "FAIL"
        print(f"  - {eco.ecosystem}: {status} ({eco.score}/10, {eco.violations_count} viol.)")
    print(" Artefacts    : audit_report.json / audit_report.md")
    print("------------------------------------------------------------------")
    if global_passed:
        print(" QUALIFICATION DASHBOARD REUSSIE")
        print("==================================================================")
        return 0

    print(" QUALIFICATION DASHBOARD ECHOUEE — voir audit_report.json")
    for v in all_violations[:10]:
        print(f"  [{v.severity}] {v.file}:{v.line} — {v.rule}: {v.message}")
    print("==================================================================")
    return 1


if __name__ == "__main__":
    sys.exit(main())
