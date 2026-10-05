@echo off
title CRKH Launcher
echo ======================================================================
echo          CAMPUS RESOURCE AND KNOWLEDGE HUB (CRKH) LAUNCHER
echo ======================================================================
echo.

:: 1. Check if MySQL is running on port 3306
echo [1/3] Verifying MySQL Database on port 3306...
netstat -ano | findstr :3306 >nul
if %ERRORLEVEL% NEQ 0 (
    echo Starting MySQL Server...
    start "MySQL Server" "C:\Users\Bharath Kumar\tools\mysql\bin\mysqld.exe" --console
    ping 127.0.0.1 -n 4 >nul
) else (
    echo MySQL is already running.
)

:: 2. Check if Spring Boot backend is running on port 8080
echo.
echo [2/3] Verifying Backend Application on port 8080...
netstat -ano | findstr :8080 >nul
if %ERRORLEVEL% NEQ 0 (
    echo Starting Spring Boot Backend...
    start "CRKH Backend Server" cmd.exe /k "cd /d D:\CRKH\backend && java -jar target\backend-1.0.0.jar"
    echo Waiting for application to initialize...
    ping 127.0.0.1 -n 12 >nul
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
