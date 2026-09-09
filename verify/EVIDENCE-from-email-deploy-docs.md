# EVIDENCE — fix/from-email-deploy-docs (Wave 11 / Branch 34)

## Findings (audit M1, marketing surfaces — parent-verified in source 2026-09-09)

1. **Doubled-subdomain FROM_EMAIL** (`api/send-playbook.js:19`): `freebies@freebies.malwaassetfirm.com` — `freebies.freebies` is a nonexistent subdomain. Every playbook email sent via Resend carries an unresolvable sender domain → SPF/DKIM mismatch, spoof-flag or hard rejection. **Live deliverability bug on every scorecard lead.**
2. **DEPLOY.md stale post-deploy checklist** (lines 19-22): told the operator to "Add Brevo backend for form submission" — while the shipped `api/send-playbook.js` already implements the full stack (Turnstile server-verify → Supabase Edge Function insert via service auth → Resend email). The doc's checklist was written before the build and never refreshed.

## Fixes

1. `FROM_EMAIL` → `freebies@malwaassetfirm.com` (base domain, matching the Resend-verified domain) with an explanatory comment recording the bug class.
2. DEPLOY.md checklist refreshed: form-backend item marked **[x]** with what's actually live (and the env vars); Cal.com + PDF items kept as genuinely-open **[ ]** items.

## Verification

```text
$ node --check api/send-playbook.js → SYNTAX_OK
$ grep -rn "freebies.freebies" (non-comment) → no remaining live refs
  (only the fix's explanatory comment mentions the old address)
$ vault-twin check: no second send-playbook.js exists under the brain vault —
  this repo is the API's only copy; the landing HTML twin holds no sender.
```

No test suite exists in this repo (static landing + one serverless function); `node --check` is the syntax gate, plus the grep sweeps above.

## After merge — action for G

**Redeploy the Vercel function** (or it picks up on next deploy). The FROM_EMAIL change only takes effect when `api/send-playbook.js` redeploys — until then the live function still sends from the doubled subdomain. Consider a Resend-domain check in the dashboard that `malwaassetfirm.com` is verified (it must be, given other emails work).

## Files

- `api/send-playbook.js` (FROM_EMAIL + comment)
- `DEPLOY.md` (checklist refresh)