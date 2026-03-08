Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

$Form = New-Object System.Windows.Forms.Form
$Form.Text = 'OpenClaw 安装程序'
$Form.Size = New-Object System.Drawing.Size(760, 560)
$Form.StartPosition = 'CenterScreen'
$Form.TopMost = $false

$Title = New-Object System.Windows.Forms.Label
$Title.Text = 'OpenClaw 一键安装（可视化）'
$Title.Font = New-Object System.Drawing.Font('Microsoft YaHei', 14, [System.Drawing.FontStyle]::Bold)
$Title.AutoSize = $true
$Title.Location = New-Object System.Drawing.Point(20, 18)
$Form.Controls.Add($Title)

$Desc = New-Object System.Windows.Forms.Label
$Desc.Text = '点击“开始安装”后会自动执行：环境检测 -> 安装 -> 验证。全程无需手动输入命令。'
$Desc.AutoSize = $true
$Desc.Location = New-Object System.Drawing.Point(22, 52)
$Form.Controls.Add($Desc)

$Progress = New-Object System.Windows.Forms.ProgressBar
$Progress.Location = New-Object System.Drawing.Point(22, 82)
$Progress.Size = New-Object System.Drawing.Size(700, 20)
$Progress.Minimum = 0
$Progress.Maximum = 3
$Progress.Value = 0
$Form.Controls.Add($Progress)

$StepLabel = New-Object System.Windows.Forms.Label
$StepLabel.Text = '当前状态：待开始'
$StepLabel.AutoSize = $true
$StepLabel.Location = New-Object System.Drawing.Point(22, 110)
$Form.Controls.Add($StepLabel)

$LogBox = New-Object System.Windows.Forms.TextBox
$LogBox.Multiline = $true
$LogBox.ScrollBars = 'Vertical'
$LogBox.ReadOnly = $true
$LogBox.Location = New-Object System.Drawing.Point(22, 135)
$LogBox.Size = New-Object System.Drawing.Size(700, 300)
$Form.Controls.Add($LogBox)

$OpenCheck = New-Object System.Windows.Forms.CheckBox
$OpenCheck.Text = '安装完成后自动打开项目目录（推荐）'
$OpenCheck.Checked = $true
$OpenCheck.AutoSize = $true
$OpenCheck.Location = New-Object System.Drawing.Point(22, 445)
$Form.Controls.Add($OpenCheck)

$StartBtn = New-Object System.Windows.Forms.Button
$StartBtn.Text = '开始安装'
$StartBtn.Location = New-Object System.Drawing.Point(22, 476)
$StartBtn.Size = New-Object System.Drawing.Size(120, 34)
$Form.Controls.Add($StartBtn)

$OpenBtn = New-Object System.Windows.Forms.Button
$OpenBtn.Text = '打开安装目录'
$OpenBtn.Location = New-Object System.Drawing.Point(152, 476)
$OpenBtn.Size = New-Object System.Drawing.Size(120, 34)
$OpenBtn.Enabled = $false
$Form.Controls.Add($OpenBtn)

$SaveReportBtn = New-Object System.Windows.Forms.Button
$SaveReportBtn.Text = '保存安装报告'
$SaveReportBtn.Location = New-Object System.Drawing.Point(282, 476)
$SaveReportBtn.Size = New-Object System.Drawing.Size(120, 34)
$SaveReportBtn.Enabled = $false
$Form.Controls.Add($SaveReportBtn)

$CloseBtn = New-Object System.Windows.Forms.Button
$CloseBtn.Text = '关闭'
$CloseBtn.Location = New-Object System.Drawing.Point(602, 476)
$CloseBtn.Size = New-Object System.Drawing.Size(120, 34)
$CloseBtn.Add_Click({ $Form.Close() })
$Form.Controls.Add($CloseBtn)

$Global:ReportPath = ''
$InstallDir = Join-Path $env:USERPROFILE 'openclaw'
$CoreInstaller = Join-Path $env:TEMP 'openclaw-installer.ps1'
$ScriptUrls = @{
  CoreInstaller = @(
    'https://raw.githubusercontent.com/15564412316-blip/openclaw-beginner-site/main/public/downloads/openclaw-installer.ps1',
    'https://cdn.jsdelivr.net/gh/15564412316-blip/openclaw-beginner-site@main/public/downloads/openclaw-installer.ps1'
  )
}

function Write-Log([string]$line) {
  $LogBox.AppendText("$line`r`n")
  [System.Windows.Forms.Application]::DoEvents()
}

function Download-FromMirrors([string[]]$urls, [string]$outFile) {
  foreach ($url in $urls) {
    try {
      Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $outFile
      if (Test-Path $outFile) {
        return $true
      }
    } catch {
      # Try next mirror.
    }
  }
  return $false
}

$OpenBtn.Add_Click({
  if (Test-Path $InstallDir) {
    Start-Process explorer.exe $InstallDir
  }
})

$SaveReportBtn.Add_Click({
  if (-not $Global:ReportPath -or -not (Test-Path $Global:ReportPath)) {
    [System.Windows.Forms.MessageBox]::Show('当前没有可保存的报告。', '提示') | Out-Null
    return
  }
  $dlg = New-Object System.Windows.Forms.SaveFileDialog
  $dlg.Filter = 'Text File|*.txt'
  $dlg.FileName = 'openclaw-install-report.txt'
  if ($dlg.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
    Copy-Item -Force $Global:ReportPath $dlg.FileName
    [System.Windows.Forms.MessageBox]::Show('报告已保存。', '完成') | Out-Null
  }
})

$StartBtn.Add_Click({
  try {
    $StartBtn.Enabled = $false
    $OpenBtn.Enabled = $false
    $SaveReportBtn.Enabled = $false
    $Progress.Value = 0
    $LogBox.Clear()
    $StepLabel.Text = '当前状态：准备中'

    Write-Log '[准备] 正在下载安装引擎...'
    $ok = Download-FromMirrors -urls $ScriptUrls.CoreInstaller -outFile $CoreInstaller
    if (-not $ok) {
      throw '无法下载安装引擎，请检查网络后重试。'
    }

    $steps = @(
      @{ Name = '环境检测'; Args = @('doctor') },
      @{ Name = '自动安装'; Args = @('install', '-Dir', $InstallDir) },
      @{ Name = '安装验证'; Args = @('verify', '-Dir', $InstallDir, '-SkipConfigCheck') }
    )

    for ($i = 0; $i -lt $steps.Count; $i++) {
      $step = $steps[$i]
      $StepLabel.Text = "当前状态：$($step.Name)"
      Write-Log "[$($step.Name)] 开始..."

      $output = & powershell -NoProfile -ExecutionPolicy Bypass -File $CoreInstaller @($step.Args) 2>&1
      if ($output) {
        $output | ForEach-Object { Write-Log ("  " + $_.ToString()) }
      }
      if ($LASTEXITCODE -ne 0) {
        throw "$($step.Name) 执行失败，退出码 $LASTEXITCODE"
      }

      $Progress.Value = $i + 1
      [System.Windows.Forms.Application]::DoEvents()
    }

    $reportDir = Join-Path $env:USERPROFILE '.openclaw-installer'
    $latest = Get-ChildItem -Path $reportDir -Filter 'report-*.txt' -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($latest) {
      $Global:ReportPath = $latest.FullName
      $desktopReport = Join-Path $env:USERPROFILE 'Desktop\\openclaw-install-report.txt'
      Copy-Item -Force $latest.FullName $desktopReport
      Write-Log "[报告] 已保存到桌面：openclaw-install-report.txt"
      $SaveReportBtn.Enabled = $true

      $content = Get-Content -Raw -Path $latest.FullName
      if ($content -match 'Overall:\s+PASS') {
        $StepLabel.Text = '当前状态：安装成功'
        Write-Log '[完成] 安装成功。'
        if ($OpenCheck.Checked -and (Test-Path $InstallDir)) {
          Start-Process explorer.exe $InstallDir
        }
        $OpenBtn.Enabled = $true
      } else {
        $StepLabel.Text = '当前状态：安装失败（请查看报告）'
        Write-Log '[失败] 安装未通过，请先下载报告并提交工单。'
      }
    } else {
      $StepLabel.Text = '当前状态：安装结束（未找到报告）'
      Write-Log '[提示] 未找到安装报告，请重试。'
    }
  } catch {
    $StepLabel.Text = '当前状态：安装失败'
    Write-Log ("[错误] " + $_.Exception.Message)
    [System.Windows.Forms.MessageBox]::Show("安装失败：$($_.Exception.Message)", '错误') | Out-Null
  } finally {
    $StartBtn.Enabled = $true
  }
})

[void]$Form.ShowDialog()
