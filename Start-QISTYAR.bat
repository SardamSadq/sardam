@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title QISTYAR - سیستەمی بەڕێوەبردنی قیست و سەرمایە
echo ===================================================================
echo   سیستەمی بەڕێوەبردنی قیست و سەرمایە (QISTYAR)
echo   دەستپێکردنی سیستەم لەسەر کۆمپیوتەر و بەستنەوە بە مۆبایل...
echo ===================================================================
echo.

set PORT=3000
set IS_DESKTOP_EXE=true
set OPEN_BROWSER=true

rem ڕێگەپێدانی پۆرت 3000 لە فایەروۆڵی ویندۆز بۆ ئەوەی مۆبایل بە وایفای پەیوەست بێت
netsh advfirewall firewall add rule name="QISTYAR Port 3000" dir=in action=allow protocol=TCP localport=3000 >nul 2>nul

echo [1] ناونیشانی ئەم کۆمپیوتەرە: http://localhost:3000
echo.
echo [2] بۆ کردنەوە لەسەر مۆبایل لە ڕێگەی Wi-Fi یان Hotspot:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i /c:"IPv4 Address" /c:"IP Address"') do (
    set "LOCAL_IP=%%a"
    set "LOCAL_IP=!LOCAL_IP: =!"
    echo     👉 http://!LOCAL_IP!:3000
)
echo.
echo ===================================================================
echo.

if exist "QISTYAR.exe" (
    echo دۆزینەوەی فایلی بەڕێوەبردنی سەربەخۆ QISTYAR.exe...
    start "" "http://localhost:3000"
    QISTYAR.exe
) else (
    echo پشکنینی ژینگەی Node.js لەسەر کۆمپیوتەرەکەت...
    where node >nul 2>nul
    if %errorlevel% neq 0 (
        echo [!] تێبینی: Node.js نەدۆزرایەوە. تکایە سەرەتا Node.js دابمەزرێنە لە https://nodejs.org
        pause
        exit /b
    )
    if not exist "node_modules" (
        echo دامەزراندنی پاکێجەکان بۆ یەکەمجار...
        call npm install --legacy-peer-deps --ignore-engines
    )
    if not exist "dist" (
        echo دروستکردنی فایلی وێبی پرۆژەکە (Build)...
        call npm run build
    )
    echo کردنەوەی وێبگەڕ (Browser) لەسەر http://localhost:3000 ...
    start "" "http://localhost:3000"
    call npm start
)

pause
