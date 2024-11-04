@echo off
cd /d "%~dp0"

start /b git pull origin main > NUL 2>&1

start /b call npm install > NUL 2>&1

start /b npm run dev > NUL 2>&1

exit
