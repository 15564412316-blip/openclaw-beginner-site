## OpenClaw Beginner Site

Beginner-friendly deployment and onboarding site for OpenClaw.

Current scope:

1. Guided manual installation flow
2. API key onboarding and task templates
3. MVP installer scripts (shell + PowerShell) with `doctor/install/config/verify/report`

## Installer Scripts (MVP)

Scripts are in `installer/`:

1. `installer/openclaw-installer.sh` (macOS/Linux)
2. `installer/openclaw-installer.ps1` (Windows)

Detailed usage:

- `installer/README.md`

## Getting Started

Run development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality Check

```bash
npm run lint
npm run build
```
