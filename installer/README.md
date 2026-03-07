# OpenClaw Installer (MVP)

This folder contains a minimal cross-platform installer entrypoint:

- `openclaw-installer.sh` (macOS/Linux)
- `openclaw-installer.ps1` (Windows PowerShell)

## Commands

1. `doctor`
- Check required environment: Node.js, npm, Git, network

2. `install`
- Clone/update `openclaw` repository
- Install dependencies via `npm install`

3. `config`
- Backup existing `~/.openclaw/openclaw.json`
- Write provider/model/api key config

4. `verify`
- Verify Node/npm, install directory, dependencies, config file

5. `report`
- Print latest local report paths

## Usage

### macOS/Linux

```bash
chmod +x installer/openclaw-installer.sh
./installer/openclaw-installer.sh doctor
./installer/openclaw-installer.sh install --dir "$HOME/openclaw"
./installer/openclaw-installer.sh config --api-key "sk-xxxx"
./installer/openclaw-installer.sh verify --dir "$HOME/openclaw"
./installer/openclaw-installer.sh report
```

Quick one-line (without API key config):

```bash
chmod +x installer/openclaw-installer.sh && ./installer/openclaw-installer.sh doctor && ./installer/openclaw-installer.sh install --dir "$HOME/openclaw" && ./installer/openclaw-installer.sh verify --dir "$HOME/openclaw"
```

### Windows (PowerShell)

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\installer\openclaw-installer.ps1 doctor
.\installer\openclaw-installer.ps1 install -Dir "$HOME\openclaw"
.\installer\openclaw-installer.ps1 config -ApiKey "sk-xxxx"
.\installer\openclaw-installer.ps1 verify -Dir "$HOME\openclaw"
.\installer\openclaw-installer.ps1 report
```

Quick one-line (without API key config):

```powershell
Set-ExecutionPolicy -Scope Process Bypass; .\installer\openclaw-installer.ps1 doctor; .\installer\openclaw-installer.ps1 install -Dir "$HOME\openclaw"; .\installer\openclaw-installer.ps1 verify -Dir "$HOME\openclaw"
```

## Output

Both scripts write local reports to:

- `~/.openclaw-installer/report-<timestamp>.txt`
- `~/.openclaw-installer/report-<timestamp>.json`

These reports can be used as proof of success or to submit paid support tickets.
