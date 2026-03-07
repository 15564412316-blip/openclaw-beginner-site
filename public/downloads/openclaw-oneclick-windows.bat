@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo ========================================
echo OpenClaw 一键安装器 (Windows)
echo ========================================

echo [1/4] 下载安装脚本...
set "TMP_PS1=%TEMP%\openclaw-installer.ps1"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -UseBasicParsing -Uri 'https://raw.githubusercontent.com/15564412316-blip/openclaw-beginner-site/main/public/downloads/openclaw-installer.ps1' -OutFile '%TMP_PS1%'"
if errorlevel 1 (
  echo 下载失败，请检查网络后重试。
  pause
  exit /b 1
)

echo [2/4] 环境检测...
powershell -NoProfile -ExecutionPolicy Bypass -File "%TMP_PS1%" doctor

echo [3/4] 自动安装...
powershell -NoProfile -ExecutionPolicy Bypass -File "%TMP_PS1%" install -Dir "%USERPROFILE%\openclaw"

echo [4/4] 安装验证...
powershell -NoProfile -ExecutionPolicy Bypass -File "%TMP_PS1%" verify -Dir "%USERPROFILE%\openclaw"

set "REPORT_DIR=%USERPROFILE%\.openclaw-installer"
for /f "delims=" %%f in ('dir /b /o-d "%REPORT_DIR%\report-*.txt" 2^>nul') do (
  set "LATEST_REPORT=%%f"
  goto :copy_report
)

goto :after_report

:copy_report
if not "%LATEST_REPORT%"=="" (
  copy /Y "%REPORT_DIR%\%LATEST_REPORT%" "%USERPROFILE%\Desktop\openclaw-install-report.txt" >nul
  echo 已将安装报告保存到桌面：openclaw-install-report.txt
)

:after_report
echo.
set /p OPEN_NOW=安装完成。是否立即打开项目目录? (y/n): 
if /i "%OPEN_NOW%"=="y" start "" "%USERPROFILE%\openclaw"

echo.
echo 建议：请下载并阅读 openclaw-ops-guide.txt（后续运行与API配置）
pause
