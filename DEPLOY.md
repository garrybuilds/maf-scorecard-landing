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
- Add Brevo backend for form submission (Vercel serverless function or Supabase Edge Function)
- Add Cal.com booking link
- Add PDF download link
