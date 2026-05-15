#Requires AutoHotkey v2.0

^!z::  ; Ctrl + Alt + Z
{
    SetTitleMatchMode(2)  ; partial match
    if WinExist("Elden Companion") {
        isMin := WinGetMinMax("Elden Companion")
        if (isMin = -1) {  ; window is minimized
            WinShow("Elden Companion")
            WinActivate("Elden Companion")
            
            ; Force WebView2 to repaint by nudging the window size
            Sleep(50)  ; give the window time to restore
            WinGetPos(&x, &y, &w, &h, "Elden Companion")
            WinMove(x, y, w + 1, h, "Elden Companion")
            Sleep(50)
            WinMove(x, y, w, h, "Elden Companion")
        } else {
            WinMinimize("Elden Companion")
        }
    }
}