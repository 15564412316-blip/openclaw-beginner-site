@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

set "TMP_GUI=%TEMP%\openclaw-installer-gui.ps1"

echo 正在启动 OpenClaw 可视化安装程序...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -UseBasicParsing -Uri 'https://raw.githubusercontent.com/15564412316-blip/openclaw-beginner-site/main/public/downloads/openclaw-installer-gui.ps1' -OutFile '%TMP_GUI%'"
if errorlevel 1 (
  echo 启动失败：无法下载安装程序。请检查网络后重试。
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%TMP_GUI%"
if errorlevel 1 (
  echo 安装程序异常退出，请重试。
  pause
  exit /b 1
)
