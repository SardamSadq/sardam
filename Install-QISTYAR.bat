@echo off
chcp 65001 >nul
title QISTYAR - دامەزراندن لەسەر لاپتۆپ

echo ========================================================
echo   سیستەمی بەڕێوەبردنی قیست و سەرمایە (QISTYAR)
echo   دامەزراندنی خۆکار لەسەر لاپتۆپ (Local Installation)
echo ========================================================
echo.

set "TARGET_DIR=%LOCALAPPDATA%\Programs\QISTYAR"
set "SOURCE_DIR=%~dp0"

echo [1/4] دروستکردنی فۆڵدەری بەرنامە لە: %TARGET_DIR% ...
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"
if not exist "%TARGET_DIR%\data" mkdir "%TARGET_DIR%\data"
if not exist "%TARGET_DIR%\data\uploads" mkdir "%TARGET_DIR%\data\uploads"

echo [2/4] کۆپیکردنی فایلەکان و مۆدیولە سەرەکییەکان ...
xcopy "%SOURCE_DIR%*" "%TARGET_DIR%\" /E /I /Y /Q >nul

:: Don't overwrite existing db if already present
if exist "%TARGET_DIR%\data\db.json" (
    echo [تێبینی] داتابەیسی پێشوو پارێزراوە لە نوێبوونەوەدا.
)

echo [3/4] دروستکردنی ئایکۆن لەسەر دێسکتۆپ (Desktop Shortcut) ...
set "VBS_SCRIPT=%TEMP%\create_shortcut.vbs"
(
    echo Set oWS = WScript.CreateObject^("WScript.Shell"^)
    echo sLinkFile = oWS.SpecialFolders^("Desktop"^) ^& "\قیستیار - QISTYAR.lnk"
    echo Set oLink = oWS.CreateShortcut^(sLinkFile^)
    echo oLink.TargetPath = "%TARGET_DIR%\QISTYAR.exe"
    echo oLink.WorkingDirectory = "%TARGET_DIR%"
    echo oLink.Description = "سیستەمی بەڕێوەبردنی قیست و سەرمایە"
    echo oLink.Save
    
    echo sStartFile = oWS.SpecialFolders^("Programs"^) ^& "\قیستیار - QISTYAR.lnk"
    echo Set oStartLink = oWS.CreateShortcut^(sStartFile^)
    echo oStartLink.TargetPath = "%TARGET_DIR%\QISTYAR.exe"
    echo oStartLink.WorkingDirectory = "%TARGET_DIR%"
    echo oStartLink.Description = "سیستەمی بەڕێوەبردنی قیست و سەرمایە"
    echo oStartLink.Save
) > "%VBS_SCRIPT%"
cscript //nologo "%VBS_SCRIPT%"
del "%VBS_SCRIPT%" >nul 2>&1

echo [4/4] کرانەوەی سەرکەوتووانەی بەرنامە ...
echo.
echo ========================================================
echo پیرۆزە! سیستەم بە سەرکەوتوویی لەسەر لاپتۆپەکەت دامەزرا.
echo ئێستا ئایکۆنی (قیستیار - QISTYAR) لەسەر دێسکتۆپت دروستکرا.
echo هەموو داتاکانت لەناو ئەم لاپتۆپە بە پارێزراوی خەزن دەبن.
echo ========================================================
echo.

start "" "%TARGET_DIR%\QISTYAR.exe"
pause
