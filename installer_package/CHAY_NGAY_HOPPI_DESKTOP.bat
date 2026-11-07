@echo off
title HOPPI - SIEU AI TRO LY TU TRI 24/7 (CHU NHAN NGUYEN THANH HAI)
color 0b

echo ===============================================================================
echo     HOPPI - KHOI DONG UNG DUNG DESKTOP THOI GIAN THUC 24/7
echo ===============================================================================
echo.
echo Dang khoi chay Hoppi AI duoi dang cua so ung dung rieng biet...

set "APP_URL=https://ais-pre-n553xcvx2k5ktidnczw2m3-826729456993.asia-east1.run.app"

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
