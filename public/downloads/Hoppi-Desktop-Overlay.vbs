' Hoppi Autonomous AI Mascot - Silent Desktop Launcher
' Chạy ngầm không hiện cửa sổ đen CMD, ghim Hoppi thẳng ra góc màn hình Desktop Windows
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "msedge.exe --app=http://localhost:3000/?desktop_widget=true --window-size=320,400 --window-position=1580,640", 0, False
