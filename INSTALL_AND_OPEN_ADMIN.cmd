@echo off
setlocal EnableExtensions EnableDelayedExpansion
title VibeUI 2026 - Environment Setup

:: Relaunch as Administrator when needed.
net session >nul 2>&1
if not "%errorlevel%"=="0" (
  echo Requesting Administrator permission...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

set "SOURCE=%~dp0"
set "TARGET=C:\a_fiyandha\VibeUI-Competition-2026"

echo.
echo ============================================================
echo   VibeUI Challenge 2026 - One Click Windows Setup
echo ============================================================
echo Source : %SOURCE%
echo Target : %TARGET%
echo.

if not exist "%TARGET%" mkdir "%TARGET%"

:: Copy this winning pack into the requested project folder.
:: Existing files are preserved unless this pack has a newer copy.
for %%A in ("%SOURCE:~0,-1%") do set "SOURCE_FULL=%%~fA"
for %%A in ("%TARGET%") do set "TARGET_FULL=%%~fA"

if /I not "%SOURCE_FULL%"=="%TARGET_FULL%" (
  echo [1/7] Copying project into target folder...
  robocopy "%SOURCE%" "%TARGET%" /E /COPY:DAT /DCOPY:DAT /R:2 /W:1 /XD ".git" /XF "INSTALL_AND_OPEN_ADMIN.cmd" >nul
  if errorlevel 8 (
    echo ERROR: Project copy failed.
    pause
    exit /b 1
  )
) else (
  echo [1/7] Project is already in the target folder.
)

echo [2/7] Checking Windows Package Manager...
where winget >nul 2>&1
if errorlevel 1 (
  echo WARNING: winget is unavailable. Install "App Installer" from Microsoft Store.
  echo The script will continue with software already installed.
) else (
  where git >nul 2>&1
  if errorlevel 1 (
    echo Installing Git...
    winget install --id Git.Git -e --silent --accept-package-agreements --accept-source-agreements
  ) else (
    echo Git already installed.
  )

  where node >nul 2>&1
  if errorlevel 1 (
    echo Installing Node.js LTS...
    winget install --id OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements
  ) else (
    echo Node.js already installed.
  )

  where gh >nul 2>&1
  if errorlevel 1 (
    echo Installing GitHub CLI...
    winget install --id GitHub.cli -e --silent --accept-package-agreements --accept-source-agreements
  ) else (
    echo GitHub CLI already installed.
  )
)

:: Refresh common PATH locations in this CMD session.
set "PATH=%PATH%;C:\Program Files\Git\cmd;C:\Program Files\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Programs\Microsoft VS Code\bin;C:\Program Files\Microsoft VS Code\bin;C:\Program Files\GitHub CLI"

echo [3/7] Checking Codex CLI...
where codex >nul 2>&1
if errorlevel 1 (
  where npm >nul 2>&1
  if errorlevel 1 (
    echo WARNING: npm is not available yet. Restart Windows, then run this script again.
  ) else (
    echo Installing the official OpenAI Codex CLI...
    call npm install -g @openai/codex
  )
) else (
  echo Codex CLI already installed.
)

echo [4/7] Installing VS Code extensions...
where code >nul 2>&1
if errorlevel 1 (
  echo WARNING: VS Code command line was not found.
  echo Open VS Code manually and install Live Server + Prettier.
) else (
  call code --install-extension ritwickdey.LiveServer --force
  call code --install-extension esbenp.prettier-vscode --force
)

echo [5/7] Configuring Git identity...
where git >nul 2>&1
if errorlevel 1 (
  echo WARNING: Git command is still unavailable. Restart Windows and rerun this file.
) else (
  for /f "delims=" %%G in ('git config --global user.name 2^>nul') do set "CURRENT_NAME=%%G"
  if not defined CURRENT_NAME (
    set /p "GIT_NAME=Enter your Git/GitHub display name: "
    if defined GIT_NAME git config --global user.name "!GIT_NAME!"
  ) else (
    echo Git name: !CURRENT_NAME!
  )

  for /f "delims=" %%G in ('git config --global user.email 2^>nul') do set "CURRENT_EMAIL=%%G"
  if not defined CURRENT_EMAIL (
    set /p "GIT_EMAIL=Enter the email connected to GitHub: "
    if defined GIT_EMAIL git config --global user.email "!GIT_EMAIL!"
  ) else (
    echo Git email: !CURRENT_EMAIL!
  )

  cd /d "%TARGET%"
  if not exist ".git" (
    git init
    git branch -M main
    git add .
    git commit -m "chore: initialize VibeUI competition project"
  ) else (
    echo Existing Git repository detected. No repository reset performed.
  )
)

echo [6/7] Running safety checks...
cd /d "%TARGET%"
where node >nul 2>&1
if not errorlevel 1 (
  node --check app.js
  if errorlevel 1 (
    echo ERROR: app.js failed syntax validation.
    pause
    exit /b 1
  )
  node --check data.js
  if errorlevel 1 (
    echo ERROR: data.js failed syntax validation.
    pause
    exit /b 1
  )
  echo JavaScript syntax checks passed.
)

echo [7/7] Opening project...
if exist "%TARGET%\README.md" start "" "%TARGET%\README.md"
where code >nul 2>&1
if not errorlevel 1 start "" code "%TARGET%"

echo.
echo ============================================================
echo SETUP COMPLETE
echo Project: %TARGET%
echo.
echo Next:
echo 1. Double-click START_PREVIEW.cmd inside the project.
echo 2. Run "codex" in the VS Code terminal and sign in.
echo 3. Replace assets\sponsor\sponsor-placeholder.svg on event day.
echo 4. Create or connect the final GitHub repository.
echo ============================================================
echo.
pause
