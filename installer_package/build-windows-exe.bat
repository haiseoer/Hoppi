@echo off
setlocal enabledelayedexpansion
title HOPPI AI - TRINH CAI DAT VA XUAT FILE .EXE TU DONG CHO WINDOWS
color 0b

echo ===============================================================================
echo     HOPPI - SIEU AI TRO LY TU TRI 24/7 (NGUYEN THANH HAI)
echo     TRINH CAI DAT VA DONG GOI FILE .EXE TU DONG 100% CHO WINDOWS
echo ===============================================================================
echo.
echo Thu muc hien tai: %~dp0
echo.

cd /d "%~dp0.."

where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0c
    echo [CANH BAO QUAN TRONG] May tinh chua cai dat moi truong Node.js!
    echo Node.js la cong cu bat buoc de dong goi file .exe va chay ung dung.
    echo.
    echo Dang mo trinh duyet den trang tai Node.js LTS mien phi (nhan Next lien tuc de cai dat)...
    start https://nodejs.org/en/download/
    echo.
    echo Sau khi cai xong Node.js, hay chay lai file .bat nay nhe!
    echo ===============================================================================
    pause
    exit /b 1
)

echo [BUOC 1/4] Kiem tra moi truong Node.js: OK! Phien ban:
node -v
npm -v
echo.

echo [BUOC 2/4] Dang tu dong cai dat cac thu vien can thiet (npm install)...
call npm install
if %errorlevel% neq 0 (
    call npm install --legacy-peer-deps
)

echo.
echo [BUOC 3/4] Dang bien dich va build ma nguon (npm run build)...
call npm run build

echo.
echo [BUOC 4/4] Dang tao file cai dat Windows .EXE (Electron Builder)...
call npx --yes electron-builder --config electron-builder.json --win

echo.
echo ===============================================================================
echo  [HOAN TAT 100%] DA DONG GOI FILE CAI DAT WINDOWS THANH CONG!
echo ===============================================================================
echo.
echo Cac file cai dat da duoc tao tai:
echo  - dist_installer\Hoppi AI 24-7 Setup.exe
echo  - dist_installer\Hoppi AI 24-7.exe
echo.
explorer "%~dp0..\dist_installer"
pause
