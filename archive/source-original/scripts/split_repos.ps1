<#
=====================================================================
SCRIPT : split_repos.ps1
ROLE  : Migration automatique vers l'architecture multi-repo (5 repos)
AUTEUR: Tayierjiang Tayier — Architecte Logiciel Senior
DATE  : Avril 2026
SÉCURITÉ: Point de restauration = tag git "pre-split-safety-checkpoint"
=====================================================================
#>

# ======================================================
# 1. CONFIGURATION
# ======================================================
$ErrorActionPreference = "Stop"

# Répertoire source (racine actuelle du projet)
$SOURCE_ROOT = Get-Location

# Répertoire cible pour les 5 repos (dossier parent)
$TARGET_ROOT = Join-Path (Join-Path $SOURCE_ROOT "..") "multi-repo-target"

# Mapping repo -> sous-dossiers source
$REPO_MAP = @{
    "backend" = @(
        "batimentRenovation",
        "data",
        "scripts",
        "tests",
        "manage.py",
        "requirements.txt",
        "pytest.ini",
        "LICENSE"
    )
    "web-mvt" = @(
        "templates",
        "static",
        "RenovateApp_Launcher"
    )
    "desktop-react" = @(
        "app_launcher"
    )
    "docs" = @(
        "docs"
    )
    "archive" = @(
        "TAYIER_V1_LEGACY_DELIVERY.zip"
    )
}

# ======================================================
# 2. VÉRIFICATIONS DE SÉCURITÉ
# ======================================================
Write-Host "`n=== VÉRIFICATION DE SÉCURITÉ ===" -ForegroundColor Yellow

# Vérifier que le tag de sécurité existe
$tagExists = git tag -l "pre-split-safety-checkpoint"
if (-not $tagExists) {
    throw "Le tag de sécurité 'pre-split-safety-checkpoint' n'existe pas. Fais un commit de sécurité d'abord."
}

# Vérifier que le working tree est propre
$status = git status --porcelain
if ($status) {
    Write-Host "ATTENTION : Le working tree n'est pas propre. Fais un commit avant de continuer." -ForegroundColor Red
    Write-Host "  -> Lance : git add -A; git commit -m 'chore: safety checkpoint'"
    exit 1
}

Write-Host "✓ Tag de sécurité trouvé : $tagExists" -ForegroundColor Green
Write-Host "✓ Working tree propre" -ForegroundColor Green

# ======================================================
# 3. CRÉATION DE LA STRUCTURE CIBLE
# ======================================================
Write-Host "`n=== CRÉATION DE LA STRUCTURE CIBLE ===" -ForegroundColor Yellow

# Vérifier si le dossier cible existe déjà avec des README (migration complète)
$migrationComplete = $true
foreach ($repo in $REPO_MAP.Keys) {
    $readmeCheck = Join-Path (Join-Path $TARGET_ROOT $repo) "README.md"
    if (-not (Test-Path $readmeCheck)) {
        $migrationComplete = $false
        break
    }
}

if ((Test-Path $TARGET_ROOT) -and $migrationComplete) {
    Write-Host "⚠ La migration est déjà complète dans : $TARGET_ROOT" -ForegroundColor Yellow
    Write-Host "  -> Supprime-le manuellement si tu veux relancer : Remove-Item -Recurse -Force $TARGET_ROOT"
    exit 0
}

New-Item -ItemType Directory -Path $TARGET_ROOT -Force | Out-Null
Write-Host "✓ Dossier cible prêt : $TARGET_ROOT" -ForegroundColor Green

# ======================================================
# 4. MIGRATION DES FICHIERS PAR REPO
# ======================================================
foreach ($repo in $REPO_MAP.Keys) {
    Write-Host "`n--- Migration vers : $repo ---" -ForegroundColor Cyan

    # Créer le dossier du repo
    $repoPath = Join-Path $TARGET_ROOT $repo
    New-Item -ItemType Directory -Path $repoPath -Force | Out-Null

    # Copier chaque élément du mapping
    foreach ($item in $REPO_MAP[$repo]) {
        $sourceItem = Join-Path $SOURCE_ROOT $item
        $destItem = Join-Path $repoPath $item

        if (Test-Path $sourceItem) {
            Write-Host "  ✓ Copie : $item"
            Copy-Item -Path $sourceItem -Destination $destItem -Recurse -Force
        } else {
            Write-Host "  ⚠ Manquant : $item" -ForegroundColor Yellow
        }
    }

    # Copier une copie du LICENSE si présent
    $licensePath = Join-Path $SOURCE_ROOT "LICENSE"
    if (Test-Path $licensePath) {
        Copy-Item -Path $licensePath -Destination (Join-Path $repoPath "LICENSE") -Force
        Write-Host "  ✓ LICENSE copié"
    }
}

# ======================================================
# 5. CRÉATION DES README PAR REPO
# ======================================================
Write-Host "`n=== CRÉATION DES README PAR REPO ===" -ForegroundColor Yellow

foreach ($repo in $REPO_MAP.Keys) {
    $readmePath = Join-Path (Join-Path $TARGET_ROOT $repo) "README.md"
    $iconMap = @{
        "backend" = "🟢 Backend"
        "web-mvt" = "🖥️ Frontend Web MVT"
        "desktop-react" = "⚛️ Frontend React + Desktop"
        "docs" = "📚 Documentation"
        "archive" = "🗄️ Archive"
    }

    $desc = $iconMap[$repo]
    @"
# $repo

> $desc — Django Enterprise Platform
> Rendue indépendante lors du split multi-repo (Avril 2026).

## Point de restauration
- Tag git source : \`pre-split-safety-checkpoint\`

## Documentation
Voir le repo \`docs\` pour l'historique complet et les specs.
"@ | Set-Content -Path $readmePath -Encoding UTF8
    Write-Host "  ✓ README créé pour $repo"
}

# ======================================================
# 6. INITIALISATION GIT PAR REPO
# ======================================================
Write-Host "`n=== INITIALISATION GIT PAR REPO (optionnel) ===" -ForegroundColor Yellow
Write-Host "Les repos cibles ont été créés. Pour les initialiser en repos Git :"

foreach ($repo in $REPO_MAP.Keys) {
    $repoPath = Join-Path $TARGET_ROOT $repo
    Write-Host @"

# Repo $repo
cd $repoPath
git init
git add -A
git commit -m "chore: initial import from monorepo (safety: $tagExists)"
git branch -M main
"@ -ForegroundColor DarkGray
}

# ======================================================
# 7. RÉSUMÉ FINAL
# ======================================================
Write-Host "`n========== RÉSUMÉ ==========" -ForegroundColor Green
Write-Host "✓ Migration terminée !"

Write-Host "`nStructure créée :"
foreach ($repo in $REPO_MAP.Keys) {
    Write-Host "  📁 $repo/" -ForegroundColor Cyan
    foreach ($item in $REPO_MAP[$repo]) {
        Write-Host "       ├── $item"
    }
}

Write-Host "`n⚠ IMPORTANT : Le repo source est INTACT (copie, pas déplacement)."
Write-Host "  - Vérifie la structure dans : $TARGET_ROOT"
Write-Host "  - Supprime manuellement la source après validation."
Write-Host "  - Point de restauration : git checkout pre-split-safety-checkpoint"

Write-Host @"

========== PROCHAINS ÉTAPES ==========
1. Vérifier la structure dans $TARGET_ROOT
2. Adapter backend/settings.py pour les chemins templates/static
3. Séparer DEMARRER.py (Django vs PyQt6)
4. Créer les 5 repos sur GitHub/GitLab
5. Configurer les droits RBAC (voir docs/ARCHITECTURE_MULTI_REPO.md)
"@ -ForegroundColor Yellow