@echo off
chcp 65001 >nul
title دروستکردنی فایلی QISTYAR.exe لەسەر Windows
echo ===================================================================
echo   دروستکردنی فایلی جێبەجێکاری سەربەخۆ (QISTYAR.exe)
echo   سیستەمی بەڕێوەبردنی قیست و سەرمایە
echo ===================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] تێبینی: سەرەتا پێویستت بە Node.js دەبێت. تکایە لە https://nodejs.org دایبەزێنە.
    pause
    exit /b
)

echo [1/4] پشکنین و دابەزاندنی پاکێجەکان...
call npm install

echo [2/4] دروستکردنی فایلی بەشی پێشەوە (React Frontend)...
call npm run build

echo [3/4] بەستنەوەی سێرڤەر بە یەک فایل (esbuild)...
if not exist "dist-desktop" mkdir dist-desktop
call npx esbuild server.ts --bundle --platform=node --target=node20 --format=cjs --outfile=dist-desktop\bundle.cjs --external:vite

echo [4/4] دروستکردنی فایلی کۆتایی QISTYAR.exe...
call npx --yes @yao-pkg/pkg dist-desktop\bundle.cjs --targets node20-win-x64 --output QISTYAR.exe

if exist "QISTYAR.exe" (
    echo.
    echo ===================================================================
    echo   [سەرکەوتوو بوو!] فایلی QISTYAR.exe بە سەرکەوتوویی دروستکرا!
    echo   ئێستا دەتوانیت دوو کلیکی لێ بکەیت و بەبێ ئینتەرنێت کاری پێبکەیت.
    echo ===================================================================
) else (
    echo.
    echo [!] تێبینی: دروستکردنی EXE کێشەی تێکەوت، بەڵام دەتوانیت بە فایلی Start-QISTYAR.bat دەستبەجێ سیستەمەکە بکەیتەوە.
)

echo.
pause
