@echo off
title Renovate Energy - Control Center
cd /d "%~dp0"
cls
echo.
echo   ====================================================
echo       RENOVATE ENERGY - UNIFIED CONTROL CENTER
echo   ====================================================
echo.
echo   [+] Lancement du centre de controle...
echo   [+] Interface Web disponible dans votre navigateur.
echo.
python launcher\simple_launcher.py
if errorlevel 1 (
    echo.
    echo   [!] Une erreur est survenue lors de l'execution du lanceur.
)
echo.
echo   Le centre de controle s'est ferme.
pause
