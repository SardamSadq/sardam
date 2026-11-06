@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title دروستکردنی فایلی QISTYAR.exe لەسەر Windows
echo ===================================================================
echo   دروستکردنی فایلی سەربەخۆ (QISTYAR.exe) بەبێ پێویستی بە GitHub
echo   سیستەمی بەڕێوەبردنی قیست و سەرمایە
echo ===================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] تێبینی: سەرەتا پێویستت بە Node.js دەبێت لە https://nodejs.org
    pause
    exit /b
)

echo [1/4] پشکنین و دامەزراندنی پێداویستییەکان...
call npm install --legacy-peer-deps --ignore-engines

echo [2/4] دروستکردنی فایلی ڕوکاری وێب (React Build)...
call npm run build

echo [3/4] کۆکردنەوەی سێرڤەر بە یەک فایل (server.cjs)...
if not exist "dist-desktop" mkdir dist-desktop
call npx esbuild server.ts --bundle --platform=node --target=node20 --format=cjs --outfile=dist-desktop\server.cjs --external:vite
copy /y dist-desktop\server.cjs server.cjs >nul

echo [4/4] کۆمپایڵکردنی فایلی فەرمی QISTYAR.exe...
set CSC="C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not exist %CSC% set CSC="C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"

if exist %CSC% (
    %CSC% /target:winexe /out:QISTYAR.exe Launcher.cs
) else (
    powershell -Command "Add-Type -TypeDefinition (Get-Content Launcher.cs -Raw) -OutputAssembly QISTYAR.exe -OutputType WindowsGUIProgram"
)

if exist "QISTYAR.exe" (
    echo.
    echo ===================================================================
    echo   [سەرکەوتوو بوو!] فایلی QISTYAR.exe بە سەرکەوتوویی دروستکرا!
    echo   ئێستا دەتوانیت دوو کلیک لەسەر QISTYAR.exe بکەیت و کاری پێبکەیت.
    echo ===================================================================
) else (
    echo.
    echo [!] تێبینی: دەتوانیت بە فایلی Start-QISTYAR.bat ڕاستەوخۆ کار بە سیستەمەکە بکەیت.
)

echo.
pause
