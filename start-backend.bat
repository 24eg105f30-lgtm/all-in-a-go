@echo off
echo ========================================================
echo Starting 'All in a Go' - Multi-Inventory Backend (Java Spring Boot)
echo ========================================================
cd /d "%~dp0backend"
if exist "..\tools\apache-maven-3.9.9\bin\mvn.cmd" (
    "..\tools\apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run
) else (
    mvn spring-boot:run
)
pause
