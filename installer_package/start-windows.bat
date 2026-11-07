@echo off
title Khoi Chay Hoppi AI 24/7 (Windows)
color 0a
echo =====================================================================
echo    KHOI CHAY SIEU AI TRO LY HOPPI (NGUYEN THANH HAI) TREN WINDOWS
echo =====================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LOI] Chua tim thay Node.js. Vui long tai Node.js tai https://nodejs.org/
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo Dang cai dat thu vien lan dau...
    call npm install
)

echo Dang khoi dong may chu Hoppi tren cong 3000...
start http://localhost:3000
npm run dev
pause
