@echo off
cd /d "%~dp0"
call npm run electron:dev
if errorlevel 1 (
  echo.
  echo Hubo un problema al abrir la aplicacion. Revisa el mensaje de arriba.
  pause
)
