@echo off
setlocal
title TAO SHORTCUT HOPPI AI LEN DESKTOP WINDOWS
color 0a

echo ===============================================================================
echo     HOPPI - SIEU AI TRO LY TU TRI 24/7 (NGUYEN THANH HAI)
echo     TRINH TAO SHORTCUT UNG DUNG DESKTOP WINDOWS 1-CLICK (SIEU TOC)
echo ===============================================================================
echo.

set "TARGET_EXE=%~dp0Hoppi_AI_Desktop.exe"
set "DESKTOP_DIR=%USERPROFILE%\Desktop"
set "SHORTCUT_PATH=%DESKTOP_DIR%\Hoppi AI 24-7.lnk"

echo Dang tao loi tat (Shortcut) ung dung len man hinh Desktop cua ban...
echo Duong dan Desktop: %DESKTOP_DIR%
echo.

:: Tao script VBS de sinh file .lnk chuan cua Windows
set "VBS_SCRIPT=%TEMP%\create_hoppi_shortcut.vbs"
(
    echo Set oWS = WScript.CreateObject^("WScript.Shell"^)
    echo sLinkFile = "%SHORTCUT_PATH%"
    echo Set oLink = oWS.CreateShortcut^(sLinkFile^)
    echo If oWS.CreateObject^("Scripting.FileSystemObject"^).FileExists^("%TARGET_EXE%"^) Then
    echo     oLink.TargetPath = "%TARGET_EXE%"
    echo     oLink.WorkingDirectory = "%~dp0"
    echo Else
    echo     oLink.TargetPath = "msedge.exe"
    echo     oLink.Arguments = "--app=""http://localhost:3000"" --window-size=1380,900"
    echo End If
    echo oLink.Description = "Hoppi - Sieu AI Tro Ly Tu Tri 24/7 (Nguyen Thanh Hai)"
    echo oLink.WindowStyle = 1
    echo oLink.Save
) > "%VBS_SCRIPT%"

cscript //nologo "%VBS_SCRIPT%"
del "%VBS_SCRIPT%" 2>nul

echo ===============================================================================
echo  [HOAN TAT 100%] DA TAO THANH CONG ICON HOPPI AI TREN MAN HINH DESKTOP!
echo ===============================================================================
echo.
echo Icon "Hoppi AI 24-7" da xuat hien ngay tren man hinh Desktop cua ban.
echo Ban co the nhap dup chuot vao bieu tuong de mo Hoppi AI bat cu luc nao!
echo.
pause
