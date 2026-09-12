# MAF Scorecard Landing Page — Deploy Guide

## Architecture
- Static HTML + CSS + JS (no framework, no build step)
- Vercel auto-deploys on push to `main`
- `vercel.json` enables clean URLs

## Workflow
1. Push to `staging` → Vercel creates preview deployment
2. Open PR to `main` → syntax check runs
3. Merge to `main` → Vercel deploys production

## Vercel Settings
- Framework: Other / Static
- Build Command: (leave empty)
- Output Directory: (leave empty)
- Domain: `scorecard.malwaassetfirm.com` (or similar)

## Post-Deploy
<!-- Checklist refreshed 2026-09-09 (audit M1): the previous items told the
     operator to build what the shipped code already implements. -->
- [x] Form backend — code shipped: Turnstile verify (fail-closed server gate) +
      Supabase Edge Function insert + Resend playbook email
      (api/send-playbook.js + api/turnstile-config.js; env: RESEND_API_KEY,
      TURNSTILE_SECRET, LEAD_CAPTURE_SERVICE_SECRET, TURNSTILE_SITE_KEY).
      NOTE: the Turnstile widget activates ONLY when TURNSTILE_SITE_KEY is set
      in Vercel env — until then the server gate fails closed (no email, no
      lead stored) by design. Site key is public-by-design; obtain it from the
      Cloudflare Turnstile dashboard alongside TURNSTILE_SECRET.
- [x] Cal.com booking link (already live — verified 2026-09-12 in the results view
      of the deployed page: cal.com/malwa-asset-firm/growth-blocker-analysis)
- [x] PDF download link (closed 2026-09-12): six constraint playbooks generated as
      static PDFs from the email HTML (WeasyPrint), served at /playbooks/, linked
      from the results playbook card (`Download this playbook as a PDF`).
