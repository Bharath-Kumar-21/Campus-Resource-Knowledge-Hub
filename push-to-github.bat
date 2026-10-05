@echo off
title Push CRKH to GitHub
echo ======================================================================
echo          PUSHING CRKH TO GITHUB
echo          Repository: https://github.com/Bharath-Kumar-21/Campus-Resource-CRKH-
echo ======================================================================
echo.
cd /d "D:\CRKH"
echo Checking Git Remote...
git remote -v
echo.
echo Pushing branch 'main' to GitHub origin...
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ======================================================================
    echo   SUCCESS! Pushed to https://github.com/Bharath-Kumar-21/Campus-Resource-CRKH-
    echo ======================================================================
) else (
    echo ======================================================================
    echo   If prompted, please authenticate with GitHub in this window.
    echo ======================================================================
)
echo.
pause
