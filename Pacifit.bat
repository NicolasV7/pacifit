@echo off
cd /d "%~dp0"

git pull origin main 

npm install

npm run dev

exit
