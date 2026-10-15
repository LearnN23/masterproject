@echo off
title TECHQUEST Local EOP Learning Module
echo ==============================================================
echo       TECHQUEST: Web-based EOP Learning Module
echo       Master's Thesis Research Project
echo ==============================================================
echo.
echo [1/2] Starting TECHQUEST Core Server on Port 5000...
start "TECHQUEST Server" cmd /k "cd /d %~dp0server && npm start"

timeout /t 2 /nobreak >nul

echo [2/2] Opening TECHQUEST Web Application in your default browser...
start http://localhost:5000

echo.
echo ==============================================================
echo  TECHQUEST is running at: http://localhost:5000
echo.
echo  - Student Main Study: Strict sequential unit/task locking
echo  - Evaluator/Pilot: Instant bypass to inspect all units
echo  - Rater A / Rater B: Blind marking & 4-criteria rubric
echo  - SPSS Export: Instant RFC-4180 CSV generation
echo ==============================================================
pause
