@echo off
title Renovate Energy - Lancement en cours...
echo ==========================================
echo    RENOVATE ENERGY - SYSTEME AUTONOME
echo ==========================================
:: Lancement du launcher
echo [INFO] Tentative de lancement...

:: 1. Essai avec le Python Portable (Prioritaire)
set "VENV_PYTHON=RenovateApp_Launcher\engine\venv\Scripts\python.exe"
:: 1. Essai avec le Python Portable (Prioritaire)
set "VENV_PYTHON=RenovateApp_Launcher\engine\venv\Scripts\python.exe"
set "LAUNCH_SUCCESS=0"

if exist "%VENV_PYTHON%" (
    echo [MODE] Portable (Venv) detecte.
    "%VENV_PYTHON%" "RenovateApp_Launcher\app_launcher.py"
    if errorlevel 0 set "LAUNCH_SUCCESS=1"
)

:: 2. Fallback Systeme si le Portable a echoue ou n'existe pas
if "%LAUNCH_SUCCESS%"=="0" (
    echo.
    echo [ATTENTION] Le mode Portable a echoue (bibliotheques manquantes ?).
    echo [MODE] Basculement sur le mode Systeme...
    
    echo [INFO] Verification des librairies systeme...
    pip install -r RenovateApp_Launcher\requirements.txt
    
    echo [INFO] Lancement via Python Systeme...
    python "RenovateApp_Launcher\app_launcher.py"
    
    if errorlevel 0 set "LAUNCH_SUCCESS=1"
)

if "%LAUNCH_SUCCESS%"=="0" (
    echo.
    echo [ERREUR CRITIQUE] Impossible de lancer l'application.
    pause
)
