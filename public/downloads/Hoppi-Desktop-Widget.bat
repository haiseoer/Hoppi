@echo off
title Hoppi Autonomous AI Mascot - Desktop Always-On-Top
echo ============================================================
echo   KICH HOAT HOPPI DESKTOP MASCOT 24/7 (LUON HIEN NGOAI MAN HINH)
echo   Chu nhan: Nguyen Thanh Hai (haiSEOer@gmail.com)
echo ============================================================

:: Kiem tra Chrome hoac Edge tren Windows de chay che do App Window thu gon khong viền
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="http://localhost:3000/?desktop_widget=true" --window-size=320,400 --window-position=1580,640
    exit
)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --app="http://localhost:3000/?desktop_widget=true" --window-size=320,400 --window-position=1580,640
    exit
)
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="http://localhost:3000/?desktop_widget=true" --window-size=320,400 --window-position=1580,640
    exit
)

start http://localhost:3000/?desktop_widget=true
