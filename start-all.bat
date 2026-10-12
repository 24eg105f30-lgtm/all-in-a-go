@echo off
echo ========================================================
echo Launching 'All in a Go' - Full Application (Backend + Frontend)
echo ========================================================
start "All in a Go - Java Spring Boot Backend" cmd /c "%~dp0start-backend.bat"
timeout /t 5 >nul
start "All in a Go - React Frontend" cmd /c "%~dp0start-frontend.bat"
timeout /t 3 >nul
start http://localhost:5173
echo.
echo Application launched!
echo Backend:  http://localhost:8080/h2-console
echo Frontend: http://localhost:5173
echo.
