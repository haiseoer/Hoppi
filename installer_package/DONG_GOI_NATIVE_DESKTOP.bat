@echo off
chcp 65001 >nul
title HOPPI AI 24/7 - DONG GOI NATIVE (.EXE, .DMG, .APPIMAGE)
color 0B
cls

echo ==============================================================================
echo       HOPPI SIÊU AI TRỢ LÝ TỰ TRỊ 24/7 - BỘ ĐÓNG GÓI ELECTRON-BUILDER
echo            Tác giả: Master Nguyễn Thanh Hải (Zero-Trust Architecture)
echo ==============================================================================
echo.
echo Công cụ này sẽ tự động:
echo   1. Biên dịch ứng dụng web React Vite sang thư mục dist/
echo   2. Sử dụng electron-builder và electron-builder.json
echo   3. Đóng gói ra file cài đặt Native:
echo        - Windows:  Hoppi AI 24-7 Setup-1.0.0.exe (NSIS Installer) + Portable .exe
echo        - macOS:    Hoppi AI 24-7.dmg
echo        - Linux:    Hoppi AI 24-7.AppImage
echo.
echo ==============================================================================
echo Vui lòng chọn hành động:
echo   [1] Đóng gói Windows .exe (Khuyên dùng trên Windows)
echo   [2] Đóng gói macOS .dmg
echo   [3] Đóng gói Linux .AppImage
echo   [4] Đóng gói TẤT CẢ nền tảng (.exe + .dmg + .AppImage)
echo   [5] Dọn dẹp thư mục dist_installer/
echo   [0] Thoát
echo ==============================================================================
echo.

set /p choice="Nhập lựa chọn của bạn (0-5) [Mặc định: 1]: "
if "%choice%"=="" set choice=1

if "%choice%"=="1" goto BUILD_WIN
if "%choice%"=="2" goto BUILD_MAC
if "%choice%"=="3" goto BUILD_LINUX
if "%choice%"=="4" goto BUILD_ALL
if "%choice%"=="5" goto CLEAN
if "%choice%"=="0" goto EXIT

echo Lựa chọn không hợp lệ.
pause
exit /b

:BUILD_WIN
echo.
echo [1/2] Đang kiểm tra Node.js và npx...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Node.js chưa có trên máy. Hệ thống chuyển sang tạo file EXE siêu tốc qua C# csc.exe...
    call TAO_FILE_EXE_NGAY_LAP_TUC_KHONG_CAN_NODEJS.bat
    exit /b
)
echo [2/2] Đang thực thi đóng gói Windows .exe qua CLI tool...
node ../scripts/package-app.cjs --win
goto DONE

:BUILD_MAC
echo.
echo Đang đóng gói macOS .dmg...
node ../scripts/package-app.cjs --mac
goto DONE

:BUILD_LINUX
echo.
echo Đang đóng gói Linux .AppImage...
node ../scripts/package-app.cjs --linux
goto DONE

:BUILD_ALL
echo.
echo Đang đóng gói tất cả các nền tảng (.exe, .dmg, .AppImage)...
node ../scripts/package-app.cjs --all
goto DONE

:CLEAN
echo.
echo Đang dọn dẹp...
node ../scripts/package-app.cjs --clean
goto DONE

:DONE
echo.
echo ==============================================================================
echo Quá trình hoàn tất! Kiểm tra thư mục: dist_installer/
echo ==============================================================================
pause
exit /b

:EXIT
exit /b
