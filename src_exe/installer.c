#define UNICODE
#define _UNICODE
#include <windows.h>
#include <shellapi.h>
#include <shlobj.h>
#include <shlwapi.h>
#include <stdio.h>
#include <stdbool.h>

// Hoppi Autonomous AI Agent Installer - Master Nguyen Thanh Hai (haiSEOer@gmail.com)

bool FileExistsW(const wchar_t *path) {
    DWORD dwAttrib = GetFileAttributesW(path);
    return (dwAttrib != INVALID_FILE_ATTRIBUTES && !(dwAttrib & FILE_ATTRIBUTE_DIRECTORY));
}

void CreateDesktopBatShortcut(const wchar_t *desktopPath, const wchar_t *exePath) {
    wchar_t shortcutPath[MAX_PATH];
    wsprintfW(shortcutPath, L"%s\\Hoppi AI Agent 24-7.bat", desktopPath);

    FILE *f = _wfopen(shortcutPath, L"w");
    if (f) {
        fwprintf(f, L"@echo off\n");
        fwprintf(f, L"title Hoppi Autonomous AI Agent 24/7\n");
        fwprintf(f, L"start \"\" \"%s\"\n", exePath);
        fclose(f);
    }
}

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, PWSTR lpCmdLine, int nCmdShow) {
    wchar_t currentDir[MAX_PATH];
    GetModuleFileNameW(NULL, currentDir, MAX_PATH);
    PathRemoveFileSpecW(currentDir);

    wchar_t launcherExe[MAX_PATH];
    wcscpy(launcherExe, currentDir);
    PathAppendW(launcherExe, L"Hoppi_AI_Desktop.exe");

    wchar_t desktopPath[MAX_PATH];
    if (SUCCEEDED(SHGetFolderPathW(NULL, CSIDL_DESKTOPDIRECTORY, NULL, 0, desktopPath))) {
        CreateDesktopBatShortcut(desktopPath, launcherExe);
    }

    wchar_t msg[1024];
    wsprintfW(msg,
        L"Cai dat Hoppi Autonomous AI Agent 24/7 thanh cong!\n\n"
        L"Chu nhan: Nguyen Thanh Hai (haiSEOer@gmail.com)\n"
        L"He thong: Hoppi Autonomous AI Agent v4.0 Final\n\n"
        L"Bieu tuong khoi chay 'Hoppi AI Agent 24-7' da duoc tao tren Man hinh Desktop!\n"
        L"May chu cuc bo sieu toc dang tu dong khoi dong...");

    MessageBoxW(NULL, msg, L"Hoppi AI - Cai Dat Thanh Cong", MB_OK | MB_ICONINFORMATION);

    // Launch Hoppi_AI_Desktop.exe if present
    if (FileExistsW(launcherExe)) {
        ShellExecuteW(NULL, L"open", launcherExe, NULL, currentDir, SW_SHOWNORMAL);
    } else {
        // Fallback open local or default URL
        ShellExecuteW(NULL, L"open", L"http://localhost:3000", NULL, NULL, SW_SHOWNORMAL);
    }

    return 0;
}
