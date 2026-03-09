@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

set "SCRIPT_DIR=%~dp0"
set "PAYLOAD_DIR=%SCRIPT_DIR%..\payload"
set "CORE_SCRIPT=%PAYLOAD_DIR%\openclaw-installer.ps1"
set "TARGET_DIR=%USERPROFILE%\openclaw"
set "LOG_FILE=%USERPROFILE%\Desktop\openclaw-install-console.log"

if not exist "%CORE_SCRIPT%" (
  echo [错误] 找不到安装脚本：%CORE_SCRIPT%
  pause
  exit /b 1
)

echo OpenClaw 一键安装正在启动...
echo 日志文件：%LOG_FILE%
echo.

echo ===== OpenClaw Installer ===== > "%LOG_FILE%"
echo Start Time: %DATE% %TIME% >> "%LOG_FILE%"
echo Target Dir: %TARGET_DIR% >> "%LOG_FILE%"
echo. >> "%LOG_FILE%"

echo [1/3] 环境检测...
powershell -NoProfile -ExecutionPolicy Bypass -File "%CORE_SCRIPT%" doctor >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [失败] 环境检测失败，请查看桌面日志：openclaw-install-console.log
  pause
  exit /b 1
)

echo [2/3] 自动安装（首次会较慢，请耐心等待）...
powershell -NoProfile -ExecutionPolicy Bypass -File "%CORE_SCRIPT%" install -Dir "%TARGET_DIR%" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [失败] 自动安装失败，请查看桌面日志：openclaw-install-console.log
  pause
  exit /b 1
)

echo [3/3] 安装验证...
powershell -NoProfile -ExecutionPolicy Bypass -File "%CORE_SCRIPT%" verify -Dir "%TARGET_DIR%" -SkipConfigCheck >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [失败] 安装验证失败，请查看桌面日志：openclaw-install-console.log
  pause
  exit /b 1
)

echo.
echo [完成] 安装成功。
echo 你可以打开：%TARGET_DIR%
echo.
echo [完成] 安装成功。 >> "%LOG_FILE%"
echo End Time: %DATE% %TIME% >> "%LOG_FILE%"

start "" explorer.exe "%TARGET_DIR%"
pause
exit /b 0
