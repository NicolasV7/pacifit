@echo off
cd /d "%~dp0"

git pull origin main

start /b call npm install > NUL 2>&1

start /b npm run dev > NUL 2>&1

exit
