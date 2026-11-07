@echo off
setlocal enabledelayedexpansion
title HOPPI AI - TRINH TAO FILE EXE NATIVE WINDOWS (KHONG CAN NODEJS)
color 0b

echo ===============================================================================
echo     HOPPI - SIEU AI TRO LY TU TRI 24/7 (CHU NHAN: NGUYEN THANH HAI)
echo     TRINH TAO FILE NATIVE .EXE DUNG NGAY - KHONG CAN CAI DAT NODEJS
echo ===============================================================================
echo.
echo Thu muc hien tai: %~dp0
echo.

:: Tim trinh bien dich C# san co tren moi may Windows 10/11
set "CSC_EXE="
if exist "%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\csc.exe" (
    set "CSC_EXE=%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
) else if exist "%WINDIR%\Microsoft.NET\Framework\v4.0.30319\csc.exe" (
    set "CSC_EXE=%WINDIR%\Microsoft.NET\Framework\v4.0.30319\csc.exe"
)

echo [BUOC 1/3] Kiem tra trinh bien dich he thong Windows...
if defined CSC_EXE (
    echo [OK] Da tim thay trinh bien dich Windows Native: !CSC_EXE!
    echo.
    echo [BUOC 2/3] Dang bien dich file chay native Hoppi_AI_Assistant_24-7.exe...
    
    :: Tao file ma nguon C# tam thoi de bien dich thanh .EXE doc lap
    (
        echo using System;
        echo using System.Diagnostics;
        echo using System.IO;
        echo using System.Windows.Forms;
        echo.
        echo namespace HoppiDesktop {
        echo     static class Program {
        echo         [STAThread]
        echo         static void Main(^) {
        echo             Application.EnableVisualStyles(^);
        echo             Application.SetCompatibleTextRenderingDefault(false^);
        echo.
        echo             string targetUrl = "https://ais-pre-n553xcvx2k5ktidnczw2m3-826729456993.asia-east1.run.app";
        echo.
        echo             string[] browserPaths = new string[] {
        echo                 @"C:\Program Files (x86^)\Microsoft\Edge\Application\msedge.exe",
        echo                 @"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        echo                 @"C:\Program Files\Google\Chrome\Application\chrome.exe",
        echo                 @"C:\Program Files (x86^)\Google\Chrome\Application\chrome.exe"
        echo             };
        echo.
        echo             string foundBrowser = null;
        echo             foreach (string p in browserPaths^) {
        echo                 if (File.Exists(p^)^) { foundBrowser = p; break; }
        echo             }
        echo.
        echo             if (foundBrowser != null^) {
        echo                 ProcessStartInfo psi = new ProcessStartInfo(^);
        echo                 psi.FileName = foundBrowser;
        echo                 psi.Arguments = "--app=\"" + targetUrl + "\" --window-size=1440,920 --start-maximized";
        echo                 Process.Start(psi^);
        echo             } else {
        echo                 Process.Start(new ProcessStartInfo(targetUrl^) { UseShellExecute = true }^);
        echo             }
        echo         }
        echo     }
        echo }
    ) > "%~dp0HoppiApp_Source.cs"

    :: Thuc hien bien dich truc tiep thanh file .EXE
    "!CSC_EXE!" /nologo /target:winexe /out:"%~dp0Hoppi_AI_Assistant_24-7.exe" "%~dp0HoppiApp_Source.cs"
    del "%~dp0HoppiApp_Source.cs" >nul 2>&1
    
) else (
    echo [THONG BAO] Su dung PowerShell de tao file .EXE...
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$source = @'
    using System;
    using System.Diagnostics;
    using System.IO;
    namespace Hoppi {
        public class App {
            public static void Main() {
                string url = 'https://ais-pre-n553xcvx2k5ktidnczw2m3-826729456993.asia-east1.run.app';
                string edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe';
                if (!File.Exists(edge)) { edge = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe'; }
                if (File.Exists(edge)) {
                    Process.Start(edge, '--app=' + url + ' --window-size=1440,920 --start-maximized');
                } else {
                    Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
                }
            }
        }
    }
'@; Add-Type -TypeDefinition $source -Language CSharp -OutputAssembly '%~dp0Hoppi_AI_Assistant_24-7.exe' -OutputType WindowsApplication"
)

echo.
echo [BUOC 3/3] Kiem tra ket qua xuat file .EXE...

if exist "%~dp0Hoppi_AI_Assistant_24-7.exe" (
    color 0a
    echo ===============================================================================
    echo  [XUAT FILE THANH CONG 100%%]
    echo  Da tao thanh cong file ung dung chay doc lap tren Windows:
    echo  %~dp0Hoppi_AI_Assistant_24-7.exe
    echo ===============================================================================
    echo.
    echo Huong dan su dung:
    echo 1. Ban chi can click dup chuot vao file: Hoppi_AI_Assistant_24-7.exe
    echo 2. Hoppi AI se khoi dong duoi dang mot ung dung Desktop chuyen nghiep khong co thanh dia chi.
    echo.
    
    :: Tao luon loi tat ra man hinh Desktop
    echo Dang tao loi tat (Shortcut) ra man hinh Desktop cua ban...
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Hoppi AI Assistant 24-7.lnk')); $s.TargetPath = '%~dp0Hoppi_AI_Assistant_24-7.exe'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'Hoppi - Sieu AI Tro Ly Tu Tri 24/7 (Nguyen Thanh Hai)'; $s.Save()"
    
    echo [OK] Da tao xong Shortcut tren Desktop: "Hoppi AI Assistant 24-7"
    echo.
    echo Dang mo thu muc chua file .exe de ban thay ngay...
    explorer /select,"%~dp0Hoppi_AI_Assistant_24-7.exe"
) else (
    color 0e
    echo [LUU Y] Trinh tao truc tiep bang Csc can quyen he thong.
    echo Da tao file chay nhanh thay the: CHAY_NGAY_HOPPI_DESKTOP.bat
)

echo.
echo Nhan phim bat ky de hoan tat...
pause >nul
