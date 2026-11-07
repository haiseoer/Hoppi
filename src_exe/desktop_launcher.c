#define UNICODE
#define _UNICODE
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

// Link libraries: -lws2_32 -lshlwapi -lshell32 -mwindows

#define WM_TRAYICON (WM_USER + 101)
#define ID_TRAY_OPEN 2001
#define ID_TRAY_STATUS 2002
#define ID_TRAY_EXIT 2003

static wchar_t g_baseDir[MAX_PATH] = {0};
static wchar_t g_webRoot[MAX_PATH] = {0};
static int g_serverPort = 3000;
static volatile bool g_running = true;
static NOTIFYICONDATAW g_nid = {0};
static HWND g_hwnd = NULL;

bool FileExistsW(const wchar_t *path) {
    DWORD dwAttrib = GetFileAttributesW(path);
    return (dwAttrib != INVALID_FILE_ATTRIBUTES && !(dwAttrib & FILE_ATTRIBUTE_DIRECTORY));
}

bool DirExistsW(const wchar_t *path) {
    DWORD dwAttrib = GetFileAttributesW(path);
    return (dwAttrib != INVALID_FILE_ATTRIBUTES && (dwAttrib & FILE_ATTRIBUTE_DIRECTORY));
}

const char* GetMimeType(const char *ext) {
    if (_stricmp(ext, ".html") == 0 || _stricmp(ext, ".htm") == 0) return "text/html; charset=utf-8";
    if (_stricmp(ext, ".js") == 0 || _stricmp(ext, ".mjs") == 0) return "application/javascript; charset=utf-8";
    if (_stricmp(ext, ".css") == 0) return "text/css; charset=utf-8";
    if (_stricmp(ext, ".json") == 0) return "application/json; charset=utf-8";
    if (_stricmp(ext, ".png") == 0) return "image/png";
    if (_stricmp(ext, ".jpg") == 0 || _stricmp(ext, ".jpeg") == 0) return "image/jpeg";
    if (_stricmp(ext, ".svg") == 0) return "image/svg+xml";
    if (_stricmp(ext, ".ico") == 0) return "image/x-icon";
    if (_stricmp(ext, ".wasm") == 0) return "application/wasm";
    if (_stricmp(ext, ".woff2") == 0) return "font/woff2";
    if (_stricmp(ext, ".mp3") == 0) return "audio/mpeg";
    return "application/octet-stream";
}

void HandleClient(SOCKET clientSocket) {
    char buffer[4096];
    int bytesReceived = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
    if (bytesReceived <= 0) {
        closesocket(clientSocket);
        return;
    }
    buffer[bytesReceived] = '\0';

    // Parse GET request line
    char method[16] = {0};
    char uri[1024] = {0};
    sscanf(buffer, "%15s %1023s", method, uri);

    if (_stricmp(method, "GET") != 0 && _stricmp(method, "HEAD") != 0) {
        const char *resp = "HTTP/1.1 405 Method Not Allowed\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";
        send(clientSocket, resp, (int)strlen(resp), 0);
        closesocket(clientSocket);
        return;
    }

    // Strip query string if any
    char *query = strchr(uri, '?');
    if (query) *query = '\0';

    // Convert URL path to relative file path
    char relPathA[1024] = {0};
    if (strcmp(uri, "/") == 0 || strcmp(uri, "") == 0) {
        strcpy(relPathA, "/index.html");
    } else {
        strncpy(relPathA, uri, sizeof(relPathA) - 1);
    }

    // Convert to wide string and replace forward slashes
    wchar_t relPathW[1024];
    MultiByteToWideChar(CP_UTF8, 0, relPathA, -1, relPathW, 1024);
    for (int i = 0; relPathW[i]; i++) {
        if (relPathW[i] == L'/') relPathW[i] = L'\\';
    }

    // Combine with web root
    wchar_t fullPath[MAX_PATH];
    wcscpy(fullPath, g_webRoot);
    PathAppendW(fullPath, relPathW);

    // If file does not exist, fallback to index.html (SPA client routing)
    if (!FileExistsW(fullPath)) {
        wchar_t spaFallback[MAX_PATH];
        wcscpy(spaFallback, g_webRoot);
        PathAppendW(spaFallback, L"index.html");
        if (FileExistsW(spaFallback)) {
            wcscpy(fullPath, spaFallback);
        } else {
            const char *resp = "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: 13\r\nConnection: close\r\n\r\n404 Not Found";
            send(clientSocket, resp, (int)strlen(resp), 0);
            closesocket(clientSocket);
            return;
        }
    }

    // Open file and stream response
    HANDLE hFile = CreateFileW(fullPath, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
    if (hFile == INVALID_HANDLE_VALUE) {
        const char *resp = "HTTP/1.1 500 Internal Error\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";
        send(clientSocket, resp, (int)strlen(resp), 0);
        closesocket(clientSocket);
        return;
    }

    LARGE_INTEGER fileSize;
    GetFileSizeEx(hFile, &fileSize);

    // Determine extension
    wchar_t *extW = PathFindExtensionW(fullPath);
    char extA[32] = {0};
    WideCharToMultiByte(CP_UTF8, 0, extW, -1, extA, sizeof(extA), NULL, NULL);
    const char *mime = GetMimeType(extA);

    char header[1024];
    int headerLen = sprintf(header,
        "HTTP/1.1 200 OK\r\n"
        "Content-Type: %s\r\n"
        "Content-Length: %lld\r\n"
        "Connection: close\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        "Cache-Control: no-cache\r\n\r\n",
        mime, fileSize.QuadPart);

    send(clientSocket, header, headerLen, 0);

    if (_stricmp(method, "GET") == 0) {
        char sendBuf[8192];
        DWORD bytesRead;
        while (ReadFile(hFile, sendBuf, sizeof(sendBuf), &bytesRead, NULL) && bytesRead > 0) {
            send(clientSocket, sendBuf, (int)bytesRead, 0);
        }
    }

    CloseHandle(hFile);
    closesocket(clientSocket);
}

DWORD WINAPI ServerThreadProc(LPVOID lpParam) {
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) return 1;

    SOCKET listenSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (listenSocket == INVALID_SOCKET) {
        WSACleanup();
        return 1;
    }

    int opt = 1;
    setsockopt(listenSocket, SOL_SOCKET, SO_REUSEADDR, (char*)&opt, sizeof(opt));

    struct sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1");
    serverAddr.sin_port = htons((u_short)g_serverPort);

    if (bind(listenSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        closesocket(listenSocket);
        WSACleanup();
        return 0;
    }

    if (listen(listenSocket, SOMAXCONN) == SOCKET_ERROR) {
        closesocket(listenSocket);
        WSACleanup();
        return 1;
    }

    while (g_running) {
        SOCKET clientSocket = accept(listenSocket, NULL, NULL);
        if (clientSocket != INVALID_SOCKET) {
            HandleClient(clientSocket);
        }
    }

    closesocket(listenSocket);
    WSACleanup();
    return 0;
}

void OpenHoppiBrowserWindow() {
    wchar_t localUrl[128];
    wsprintfW(localUrl, L"http://127.0.0.1:%d", g_serverPort);

    const wchar_t *browsers[] = {
        L"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        L"C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
        L"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        L"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        L"C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
    };

    wchar_t params[512];
    wsprintfW(params, L"--app=%s --window-size=1440,920 --start-maximized", localUrl);

    bool opened = false;
    for (int i = 0; i < 5; i++) {
        if (FileExistsW(browsers[i])) {
            HINSTANCE res = ShellExecuteW(NULL, L"open", browsers[i], params, NULL, SW_SHOWNORMAL);
            if ((INT_PTR)res > 32) {
                opened = true;
                break;
            }
        }
    }

    if (!opened) {
        ShellExecuteW(NULL, L"open", localUrl, NULL, NULL, SW_SHOWNORMAL);
    }
}

LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
        case WM_TRAYICON:
            if (lParam == WM_LBUTTONDBLCLK || lParam == WM_LBUTTONUP) {
                OpenHoppiBrowserWindow();
            } else if (lParam == WM_RBUTTONUP) {
                POINT pt;
                GetCursorPos(&pt);
                HMENU hMenu = CreatePopupMenu();
                InsertMenuW(hMenu, 0, MF_BYPOSITION | MF_STRING, ID_TRAY_OPEN, L"👑 Mo Hoppi AI Agent 24/7 (Full Screen)");
                InsertMenuW(hMenu, 1, MF_BYPOSITION | MF_STRING | MF_GRAYED, ID_TRAY_STATUS, L"🟢 Trang thai: Chay ngam 24/7 (Nguyen Thanh Hai)");
                InsertMenuW(hMenu, 2, MF_BYPOSITION | MF_SEPARATOR, 0, NULL);
                InsertMenuW(hMenu, 3, MF_BYPOSITION | MF_STRING, ID_TRAY_EXIT, L"❌ Thoat Hoan Toan");

                SetForegroundWindow(hwnd);
                TrackPopupMenu(hMenu, TPM_BOTTOMALIGN | TPM_LEFTALIGN, pt.x, pt.y, 0, hwnd, NULL);
                DestroyMenu(hMenu);
            }
            break;

        case WM_COMMAND:
            if (LOWORD(wParam) == ID_TRAY_OPEN) {
                OpenHoppiBrowserWindow();
            } else if (LOWORD(wParam) == ID_TRAY_EXIT) {
                g_running = false;
                Shell_NotifyIconW(NIM_DELETE, &g_nid);
                PostQuitMessage(0);
            }
            break;

        case WM_DESTROY:
            Shell_NotifyIconW(NIM_DELETE, &g_nid);
            PostQuitMessage(0);
            break;

        default:
            return DefWindowProcW(hwnd, msg, wParam, lParam);
    }
    return 0;
}

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, PWSTR lpCmdLine, int nCmdShow) {
    // 1. Locate base directory from .exe path
    GetModuleFileNameW(NULL, g_baseDir, MAX_PATH);
    PathRemoveFileSpecW(g_baseDir);

    // 2. Determine web root (prefer ./dist if available, else ./)
    wchar_t distDir[MAX_PATH];
    wcscpy(distDir, g_baseDir);
    PathAppendW(distDir, L"dist");

    wchar_t distIndex[MAX_PATH];
    wcscpy(distIndex, distDir);
    PathAppendW(distIndex, L"index.html");

    if (FileExistsW(distIndex)) {
        wcscpy(g_webRoot, distDir);
    } else {
        wcscpy(g_webRoot, g_baseDir);
    }

    // 3. Start embedded local HTTP server thread
    HANDLE hThread = CreateThread(NULL, 0, ServerThreadProc, NULL, 0, NULL);
    Sleep(200);

    // 4. Create hidden window for System Tray Icon & 24/7 Background Service
    WNDCLASSEXW wc = {0};
    wc.cbSize = sizeof(WNDCLASSEXW);
    wc.lpfnWndProc = WndProc;
    wc.hInstance = hInstance;
    wc.lpszClassName = L"HoppiTrayClass";
    RegisterClassExW(&wc);

    g_hwnd = CreateWindowExW(0, L"HoppiTrayClass", L"Hoppi AI Background Service", 0, 0, 0, 0, 0, NULL, NULL, hInstance, NULL);

    // 5. Register System Tray Icon
    g_nid.cbSize = sizeof(NOTIFYICONDATAW);
    g_nid.hWnd = g_hwnd;
    g_nid.uID = 1;
    g_nid.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;
    g_nid.uCallbackMessage = WM_TRAYICON;
    g_nid.hIcon = LoadIcon(NULL, IDI_APPLICATION);
    wcscpy(g_nid.szTip, L"👑 Hoppi AI Agent 24/7 - Chu nhan Nguyen Thanh Hai");
    Shell_NotifyIconW(NIM_ADD, &g_nid);

    // 6. Open App Window
    OpenHoppiBrowserWindow();

    // 7. Message loop to keep background service active
    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    g_running = false;
    if (hThread) {
        WaitForSingleObject(hThread, 500);
        CloseHandle(hThread);
    }

    return 0;
}
