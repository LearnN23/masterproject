@echo off
title TECHQUEST Development Mode (Live Hot-Reload)
color 0E

echo ===============================================================
echo     TECHQUEST: Developer Mode (Live Hot-Reload)
echo ===============================================================
echo.
echo Launching Backend Server in a new window (Port 5000)...
start "TECHQUEST Backend (Port 5000)" cmd /k "cd server && node index.js"

echo Launching Frontend Client in a new window (Port 3000)...
start "TECHQUEST Frontend (Port 3000)" cmd /k "cd client && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo When ready, open your browser to: http://localhost:3000
echo.
pause
