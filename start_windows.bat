@echo off
title TECHQUEST EOP Learning Platform
color 0B

echo ===============================================================
echo     TECHQUEST: Web-Based EOP Learning Platform (Windows)
echo ===============================================================
echo.

:: 1. Verify Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not found in your system PATH!
    echo Please download and install Node.js v22 or higher from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js detected:
node -v
echo.

:: 2. Pull latest git changes if git is available
where git >nul 2>nul
if %errorlevel% equ 0 (
    echo [1/4] Pulling latest updates from GitHub...
    git pull origin main
    echo.
) else (
    echo [1/4] Git command not found, skipping pull.
    echo.
)

:: 3. Install Server Dependencies if missing
echo [2/4] Checking server dependencies...
if not exist "server\node_modules\" (
    echo [Server] Installing npm packages (first time setup)...
    cd server
    call npm install
    cd ..
) else (
    echo [Server] Dependencies verified.
)
echo.

:: 4. Install Client Dependencies & Build Frontend
echo [3/4] Checking frontend client...
if not exist "client\node_modules\" (
    echo [Client] Installing frontend packages (first time setup)...
    cd client
    call npm install
    cd ..
)

echo [Client] Building production frontend bundle...
cd client
call npm run build
cd ..
echo.

:: 5. Launch Browser & Start Server
echo [4/4] Launching TECHQUEST Server...
echo.
echo ===============================================================
echo   TECHQUEST is running!
echo   Local Address: http://localhost:5000
echo.
echo   Keep this black window open while testing.
echo   To close the server, close this window or press Ctrl+C.
echo ===============================================================
echo.

:: Automatically open browser after 2 seconds
start "" http://localhost:5000

:: Start the server
node server/index.js

pause
