@echo off
cd /d "%~dp0"

echo Actualizando el repositorio...
git pull origin main
if errorlevel 1 (
    echo Error al actualizar el repositorio.
    exit /b 1
)

echo Instalando dependencias...
npm install
if errorlevel 1 (
    echo Error al instalar dependencias.
    exit /b 1
)

echo Iniciando la aplicación...
npm run dev
if errorlevel 1 (
    echo Error al iniciar la aplicación.
    exit /b 1
)

exit
