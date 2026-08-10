@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js non trovato. Installalo e riapri Web App Utility Hub.
  pause
  exit /b 1
)

call npm run setup
if errorlevel 1 exit /b 1
call npm run dev
