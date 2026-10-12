@echo off
title Deploy to Vercel
echo ======================================================================
echo             DEPLOYING CRKH REACT APP TO VERCEL (24/7 CLOUD)
echo             Domain: https://campus-resource-knowledge-hub.vercel.app
echo ======================================================================
echo.
cd /d "D:\CRKH"
echo [1/2] Building React production bundle...
call npm --prefix frontend run build
echo.
echo [2/2] Running Vercel deployment...
call npx --yes vercel --prod
echo.
echo ======================================================================
echo  Deployment complete! Refresh https://campus-resource-knowledge-hub.vercel.app
echo ======================================================================
echo.
pause
