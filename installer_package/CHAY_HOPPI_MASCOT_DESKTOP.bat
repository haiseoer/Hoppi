@echo off
title HOPPI - MASCOT TREN MAN HINH DESKTOP 24/7 (CHU NHAN NGUYEN THANH HAI)
color 0e

echo ===============================================================================
echo     HOPPI - MASCOT DI DONG NGOAI MAN HINH DESKTOP 24/7
echo     Chu nhan: Nguyen Thanh Hai (haiSEOer@gmail.com)
echo ===============================================================================
echo.
echo Dang khoi chay Hoppi Mascot ngoai man hinh Desktop...
echo Mascot Hoppi se hien thi o goc phai man hinh, co cam xuc, nhan dien giong noi 24/7!
echo.

set "LOCAL_URL=http://localhost:3000"
set "CLOUD_URL=https://ais-pre-n553xcvx2k5ktidnczw2m3-826729456993.asia-east1.run.app"

rem Kiem tra neu Edge hoac Chrome ho tro mode app
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="%LOCAL_URL%" --window-size=380,260 --window-position=1100,60
    exit
)

if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --app="%LOCAL_URL%" --window-size=380,260 --window-position=1100,60
    exit
)

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="%LOCAL_URL%" --window-size=380,260 --window-position=1100,60
    exit
)

start "" "%LOCAL_URL%"
exit
