@echo off
setlocal
cd /d "%~dp0"
title Hot Meal Ba - Local Preview

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not available.
  echo Run INSTALL_AND_OPEN_ADMIN.cmd first.
  pause
  exit /b 1
)

start "" "http://127.0.0.1:5500"
node tools\server.mjs
pause
