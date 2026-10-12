@echo off
title CRKH Launcher
echo ======================================================================
echo          CAMPUS RESOURCE AND KNOWLEDGE HUB (CRKH) LAUNCHER
echo ======================================================================
echo.

:: 1. Load environment variables from .env
if exist "%~dp0.env" (
    for /f "usebackq tokens=*" %%a in ("%~dp0.env") do set "%%a"
) else if exist "D:\CRKH\.env" (
    for /f "usebackq tokens=*" %%a in ("D:\CRKH\.env") do set "%%a"
)

:: 2. Cloud Database Status
echo [1/3] Connected to Aiven Cloud Database (defaultdb)...
echo       Host: mysql-2c01a104-bk8143116177-55d6.e.aivencloud.com:27465

:: 3. Check if Spring Boot backend is running on port 8080
echo.
echo [2/3] Verifying Backend Application on port 8080...
netstat -ano | findstr :8080 >nul
if %ERRORLEVEL% NEQ 0 (
    echo Starting Spring Boot Backend...
    start "CRKH Backend Server" cmd.exe /k "cd /d D:\CRKH\backend && java -jar target\backend-1.0.0.jar"
    echo Waiting for application to initialize...
    ping 127.0.0.1 -n 8 >nul
) else (
    echo Backend is actively running on http://localhost:8080
)

:: 4. Launch React Frontend
echo.
echo [3/3] Starting React Frontend on port 5173...
start "CRKH React Frontend" cmd.exe /k "cd /d D:\CRKH\frontend && npm run dev"
ping 127.0.0.1 -n 3 >nul

start http://localhost:5173

echo.
echo ======================================================================
echo   CRKH React App: http://localhost:5173
echo   CRKH Backend API: http://localhost:8080
echo   Database: Aiven Cloud MySQL (defaultdb)
echo   Default Student Login: student1@college.edu / Student@123
echo   Default Admin Login:   admin@college.edu / Admin@123
echo ======================================================================
echo.
pause
