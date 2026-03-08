@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

set "PS_EXE=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
set "TMP_GUI=%TEMP%\openclaw-installer-gui.ps1"
set "LOCAL_GUI=%~dp0openclaw-installer-gui.ps1"
set "URL_MAIN=https://raw.githubusercontent.com/15564412316-blip/openclaw-beginner-site/main/public/downloads/openclaw-installer-gui.ps1"
set "URL_MIRROR=https://cdn.jsdelivr.net/gh/15564412316-blip/openclaw-beginner-site@main/public/downloads/openclaw-installer-gui.ps1"

echo 正在启动 OpenClaw 可视化安装程序...
if exist "%LOCAL_GUI%" (
  echo 检测到本地安装器，直接启动...
  "%PS_EXE%" -NoProfile -ExecutionPolicy Bypass -File "%LOCAL_GUI%"
  if errorlevel 1 (
    echo 安装程序异常退出，请重试。
    echo 如重复失败，请把错误截图发给我排查。
    pause
    exit /b 1
  )
  exit /b 0
)

echo 正在下载启动器（主地址）...
"%PS_EXE%" -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -UseBasicParsing -Uri '%URL_MAIN%' -OutFile '%TMP_GUI%'" >nul 2>&1

if not exist "%TMP_GUI%" (
  echo 主地址下载失败，尝试镜像地址...
  "%PS_EXE%" -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ErrorActionPreference='Stop'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -UseBasicParsing -Uri '%URL_MIRROR%' -OutFile '%TMP_GUI%'" >nul 2>&1
)

if not exist "%TMP_GUI%" (
  echo 启动失败：无法下载安装程序。
  echo 请检查网络，或手动打开以下地址下载后重试：
  echo %URL_MAIN%
  echo %URL_MIRROR%
  pause
  exit /b 1
)

echo 下载成功，正在打开可视化安装窗口...
"%PS_EXE%" -NoProfile -ExecutionPolicy Bypass -File "%TMP_GUI%"
if errorlevel 1 (
  echo 安装程序异常退出，请重试。
  echo 如重复失败，请把错误截图发给我排查。
  pause
  exit /b 1
)
