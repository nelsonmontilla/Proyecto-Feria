@echo off
title Animal Advisor - Lanzador Automatico (Backend + Frontend)
echo ==========================================================
echo   Iniciando Animal Advisor - Guide to Pet Adoption
echo ==========================================================
echo.
echo [1/2] Iniciando Backend Propio en http://localhost:4000 ...
start "Animal Advisor Backend (Puerto 4000)" cmd /k "cd /d "%~dp0backend" && npm start"

timeout /t 2 /nobreak >nul

echo [2/2] Iniciando Frontend React en http://localhost:5173 ...
start "Animal Advisor Frontend (Puerto 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 3 /nobreak >nul
echo.
echo Abriendo navegador en http://localhost:5173 ...
start http://localhost:5173
