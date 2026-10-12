@echo off
title Aiven Cloud Database CLI
echo ======================================================================
echo           AIVEN CLOUD MYSQL DATABASE VIEWER (defaultdb)
echo ======================================================================
echo.

if exist "%~dp0.env" (
    for /f "usebackq tokens=*" %%a in ("%~dp0.env") do set "%%a"
) else if exist "D:\CRKH\.env" (
    for /f "usebackq tokens=*" %%a in ("D:\CRKH\.env") do set "%%a"
)

echo Connecting to mysql-2c01a104-bk8143116177-55d6.e.aivencloud.com:27465...
echo.
echo Useful commands to run:
echo   SHOW TABLES;
echo   SELECT id, name, email, role FROM users;
echo   SELECT id, title, category, status FROM resources;
echo   SELECT * FROM borrowings;
echo   exit;
echo ======================================================================
echo.

"C:\Users\Bharath Kumar\tools\mysql\bin\mysql.exe" -h mysql-2c01a104-bk8143116177-55d6.e.aivencloud.com -P 27465 -u %DB_USERNAME% --password=%DB_PASSWORD% -D defaultdb --ssl-mode=REQUIRED --prompt="aiven-mysql> "
