@echo off
cd /d "%~dp0"
echo.
echo ============================================
echo         ARYANFLIX PROJECTS IN MOTION V12
echo ============================================
echo.
echo Installing dependencies...
call npm install
if errorlevel 1 (
 echo.
 echo Installation failed. Please copy this terminal error and share it.
 pause
 exit /b 1
)
echo.
echo Running ARYANFLIX at http://localhost:5173/
call npm run dev
pause
