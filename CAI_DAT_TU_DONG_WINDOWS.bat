@echo off
setlocal enabledelayedexpansion
title HOPPI AI - TRINH XUAT FILE .EXE VA CAI DAT WINDOWS
color 0b

echo ===============================================================================
echo     HOPPI - SIEU AI TRO LY TU TRI 24/7 (NGUYEN THANH HAI)
echo     TRINH CAI DAT VA XUAT FILE .EXE TU DONG CHO WINDOWS
echo ===============================================================================
echo.
echo Thu muc chua ma nguon: %~dp0
echo.

:: BUOC 1: Kiem tra moi truong
echo [BUOC 1/4] Kiem tra moi truong may tinh cua ban...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [THONG BAO] May tinh cua ban chua cai Node.js de build Electron.
    echo Dang tu dong chuyen sang Trinh Bien Dich Windows Native de tao file .EXE ngay lap tuc...
    echo.
    call "%~dp0TAO_FILE_EXE_NGAY_LAP_TUC_KHONG_CAN_NODEJS.bat"
    exit /b 0
)

echo Moi truong Node.js hop le:
node -v
npm -v
echo.

:: BUOC 2: Cai dat dependencies
echo [BUOC 2/4] Dang cai dat thu vien va bo cong cu Electron Builder...
call npm install
call npm install --save-dev electron@latest electron-builder@latest
if %errorlevel% neq 0 (
    echo Co loi khi tai thu vien. Thu lai voi che do bo qua xung dot...
    call npm install --legacy-peer-deps
)

echo.
:: BUOC 3: Build code web
echo [BUOC 3/4] Dang bien dich ma nguon giao dien (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo [LOI] Bien dich ma nguon that bai. Vui long kiem tra file log.
    pause
    exit /b 1
)

echo.
:: BUOC 4: Xuat file EXE
echo [BUOC 4/4] Dang xuat file cai dat Windows .EXE vao thu muc dist_installer...
call npx electron-builder --config electron-builder.json --win
if %errorlevel% neq 0 (
    echo [THONG BAO] Thu dong goi qua script du an...
    call npm run dist:win
)

echo.
if exist "%~dp0dist_installer\" (
    color 0a
    echo ===============================================================================
    echo  [THANH CONG RUC RO] DA XUAT THANH CONG FILE .EXE VAO THU MUC:
    echo  %~dp0dist_installer\
    echo ===============================================================================
    echo.
    echo Danh sach file cai dat da tao:
    dir "%~dp0dist_installer\*.exe" /b
    echo.
    echo Dang tu dong mo thu muc chua file .exe cho ban...
    explorer "%~dp0dist_installer"
) else (
    echo [Luu y] Chua tim thay thu muc dist_installer.
    echo Dang tao loi tat ung dung truc tiep ra Desktop cho ban...
    call "%~dp0TAO_ICON_DESKTOP_WINDOWS.bat"
)

pause
