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

## Files (full scope of this branch — corrected 2026-09-09 review round)

- `api/send-playbook.js` (FROM_EMAIL repair + Turnstile server-side siteverify,
  fail-closed; lead insert relayed via lead-capture-submit Edge Function,
  fail-open for the email; Resend send)
- `api/turnstile-config.js` (NEW, review round — serves the public site key at
  runtime from TURNSTILE_SITE_KEY env; {sitekey: null} when unset)
- `index.html` (Turnstile widget injected at runtime via /api/turnstile-config —
  NO placeholder sitekey ships; single-use token handling with reset-before-await
  and clear-after-submit; server rejection surfaces an inline retry note)
- `DEPLOY.md` (checklist refresh, corrected to state the TURNSTILE_SITE_KEY
  activation dependency)

## Review round — 2026-09-09 (by Diwan Todar Mal / MAF agent)

Independent reviewer verdict was `passed: false` on the placeholder sitekey
(literal PLACEHOLDER_TURNSTILE_SITE_KEY in static HTML — every submission would
fail server-side: no email, no lead stored; flagged nowhere, while DEPLOY.md
marked the form backend "[x] live"). Fixes on this branch:

- Runtime sitekey config: /api/turnstile-config serves the public key from
  Vercel env; the widget injects only when configured. Placeholder eliminated.
- Token race fixes: single-use tokens cleared after each submit, widget reset
  BEFORE awaiting, no stale fast path, no reset-inside-promise.
- Server rejection now surfaces: the fetch response is inspected; a rejected
  submission shows an inline note (manual-contact fallback) instead of
  silent success.
- DEPLOY.md "[x] live" corrected to the true conditional (activation requires
  TURNSTILE_SITE_KEY); evidence Files section completed to the branch's full
  scope.

Verification (this round): node --check on both API functions and the inline
script — OK; CI's DOCTYPE gate — OK; grep: zero PLACEHOLDER_TURNSTILE refs.

Activation for G (one step): set TURNSTILE_SITE_KEY (public) in Vercel env
next to TURNSTILE_SECRET — the widget goes live on next deploy; unset, the
server gate fails closed by design.