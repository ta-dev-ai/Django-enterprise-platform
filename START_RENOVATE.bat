@echo off
setlocal
title RenovateEnergy Launcher

echo ===================================================
echo      RENOVATE ENERGY - DEMARRAGE AUTOMATIQUE
echo ===================================================
echo.

:: 1. Détection de l'environnement Python (Portable ou Système)
set "VENV_PYTHON=%~dp0RenovateApp_Launcher\engine\venv\Scripts\python.exe"
if exist "%VENV_PYTHON%" (
    echo [INFO] Mode Portable detecte (Venv integre).
    set "PYTHON_CMD=%VENV_PYTHON%"
) else (
    echo [INFO] Mode Systeme detecte (Python global).
    set "PYTHON_CMD=python"
    
    :: Vérification si Python est dans le PATH seulement si on est en mode système
    %PYTHON_CMD% --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERREUR] Python n'est pas detecte !
        echo Veuillez installer Python et l'ajouter au PATH.
        pause
        exit /b
    )
)

:: 2. Vérification des dépendances (Seulement en mode Système ou si nécessaire)
if "%PYTHON_CMD%"=="python" (
    %PYTHON_CMD% -m django --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo [INFO] Premier demarrage detecte. Installation des dependances...
        pip install -r RenovateApp_Launcher\core\requirements.txt
    )
)

:: 3. Lancement du Launcher
echo [2/3] Démarrage de l'interface graphique...
echo [3/3] Ouverture du Dashboard dans Chrome...
echo.
echo Veuillez patienter...

:: Lancer le script Python
"%PYTHON_CMD%" RenovateApp_Launcher\core\main.py

:: Si le script se ferme, on quitte
exit
