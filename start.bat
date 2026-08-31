@echo off
title DataPilot - Control Center
cd /d "%~dp0"
cls
echo.
echo   ====================================================
echo       DATAPILOT - CONTROL CENTER
echo   ====================================================
echo.
echo   [+] Lancement...
echo   [+] Interface disponible dans votre navigateur.
echo.
python launcher\simple_launcher.py
if errorlevel 1 (
    echo.
    echo   [!] Erreur lors du lancement. Verifiez Python 3.12+ installe.
)
echo.
pause
