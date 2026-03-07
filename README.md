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

## Admin Review (MVP)

1. Set env vars in `.env.local`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_REVIEW_TOKEN`
   - `PAYMENT_PROVIDER` (`mock` for now)
   - `PAYMENT_WEBHOOK_SECRET` (for webhook signature check)
   - `NEXT_PUBLIC_SITE_URL` (e.g. `http://localhost:3000`)
   - `SMS_PROVIDER` (optional now; placeholder for Tencent/Alibaba SMS)
2. Open `/admin/orders` to review pending manual-payment orders.
3. Open `/login` for phone-code login (dev mode shows `debugCode` if SMS provider is not configured).
4. For existing Supabase projects, run:
   - `docs/supabase-migration-auth-v1.sql`
   Then check login data in:
   - `app_users`
   - `auth_login_events`
   - `auth_sms_codes` (OTP temporary records)
