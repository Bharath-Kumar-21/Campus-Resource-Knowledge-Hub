@echo off
title Deploy to Vercel
echo ======================================================================
echo             DEPLOYING CRKH TO VERCEL (24/7 CLOUD)
echo             Domain: https://campus-resource-knowledge-hub.vercel.app
echo ======================================================================
echo.
cd /d "D:\CRKH"
echo Running Vercel deployment...
echo.
call npx --yes vercel --prod
echo.
echo ======================================================================
echo  Deployment complete! Refresh https://campus-resource-knowledge-hub.vercel.app
echo ======================================================================
echo.
pause
