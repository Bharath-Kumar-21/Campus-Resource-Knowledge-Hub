@echo off
title CRKH React Launcher
echo ======================================================================
echo          CAMPUS RESOURCE AND KNOWLEDGE HUB (CRKH) REACT
echo ======================================================================
echo.
cd /d "%~dp0"
echo Starting Vite React Frontend...
call npm run dev
pause
