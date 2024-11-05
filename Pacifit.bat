@echo off
cd /d "%~dp0"

git pull origin main

npm install > NUL 2>&1

npm run dev > NUL 2>&1

exit