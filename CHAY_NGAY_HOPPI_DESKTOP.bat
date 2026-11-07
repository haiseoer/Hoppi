@echo off
title HOPPI - SIEU AI TRO LY TU TRI 24/7 (CHU NHAN NGUYEN THANH HAI)
color 0b

echo ===============================================================================
echo     HOPPI - KHOI DONG UNG DUNG DESKTOP THOI GIAN THUC 24/7
echo ===============================================================================
echo.
echo Dang khoi dong may chu noi bo va mo ung dung Hoppi AI...

:: 1. Uu tien chay Hoppi_AI_Desktop.exe co san server noi bo
if exist "%~dp0Hoppi_AI_Desktop.exe" (
    start "" "%~dp0Hoppi_AI_Desktop.exe"
    exit
)

:: 2. Neu co Node.js chay server cuc bo
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo Khoi dong may chu Node.js...
    start /min "Hoppi Background Server" node server.ts
    timeout /t 2 >nul
)

set "APP_URL=http://localhost:3000"

:: 3. Uu tien khoi dong bang Microsoft Edge App Mode
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="%APP_URL%" --window-size=1440,920 --start-maximized
    exit
)

if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --app="%APP_URL%" --window-size=1440,920 --start-maximized
    exit
)

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="%APP_URL%" --window-size=1440,920 --start-maximized
    exit
)

start "" "%APP_URL%"
exit
