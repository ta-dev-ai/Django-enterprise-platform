@echo off
title DataPilot - Control Center
cd /d "%~dp0"
cls
echo.
echo   ====================================================
echo       DATAPILOT - CONTROL CENTER
echo   ====================================================
echo.
echo   [+] Lancement du Control Center...
echo   [+] Demarrage automatique : Django (8000) + React (5175)
echo   [+] Logs en cas d'erreur  : launcher\logs\
echo.
python launcher\simple_launcher.py
if errorlevel 1 (
    echo.
    echo   [!] Erreur lors du lancement. Verifiez Python 3.12+ installe.
    echo   [!] Consultez launcher\logs\django.log si Django ne demarre pas.
)
echo.
pause
