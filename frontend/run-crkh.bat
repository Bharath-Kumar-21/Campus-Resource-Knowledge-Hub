@echo off
title CRKH - Campus Resource & Knowledge Hub
echo ======================================================================
echo          CAMPUS RESOURCE & KNOWLEDGE HUB (CRKH) LAUNCHER
echo ======================================================================
echo.

:: 1. Check if MySQL is running on port 3306
echo [1/3] Verifying MySQL Database on port 3306...
netstat -ano | findstr :3306 >nul
if %ERRORLEVEL% NEQ 0 (
    echo Starting MySQL Server...
    start "" "C:\Users\Bharath Kumar\tools\mysql\bin\mysqld.exe" --console
    timeout /t 3 /nobreak >nul
) else (
    echo MySQL is already running.
)

:: 2. Check if Spring Boot backend is running on port 8080
echo.
echo [2/3] Verifying Backend Application on port 8080...
netstat -ano | findstr :8080 >nul
if %ERRORLEVEL% NEQ 0 (
    echo Starting Spring Boot Backend (crkh-backend)...
    cd /d "D:\CRKH\backend"
    start "CRKH Backend Server (Port 8080)" java -jar "D:\CRKH\backend\target\backend-1.0.0.jar"
    echo Waiting for application to initialize...
    timeout /t 10 /nobreak >nul
) else (
    echo Backend is already running on http://localhost:8080
)

:: 3. Launch browser
echo.
echo [3/3] Launching CRKH in your default web browser...
start http://localhost:8080

echo.
echo ======================================================================
echo   CRKH is actively running at: http://localhost:8080
echo   Default Student Login: student1@college.edu / Student@123
echo   Default Admin Login:   admin@college.edu / Admin@123
echo ======================================================================
echo.
pause
