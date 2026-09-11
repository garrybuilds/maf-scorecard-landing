# EVIDENCE — fix/capture-path-honesty (2026-09-10)

Probe matrix first (11 live probes, then the fix — no guessing). Trigger: G's
two live submissions showed "success" (no error note) but produced no CRM row
and no playbook email.

## Probe matrix (all live, 2026-09-10)

| # | Probe | Result |
|---|---|---|
| A | CRM `lead_captures` after both submits | No rows — insert never fired |
| B | Relay gate taxonomy (missing fields / no token / garbage token) | 400 / 400 / 403 — all fail-closed correctly; production runs current code |
| C | Resend account domains | `freebies.malwaassetfirm.com` VERIFIED (2026-07-23) — the ONLY verified domain; apex never added |
| D | Send from verified subdomain → garry@malwaassetfirm.com | **HTTP 200** (id ff45a90a) |
| D2 | Same → owner control | 200 |
| E | Apex-domain from (current code's FROM_EMAIL) | **HTTP 403 "malwaassetfirm.com is not verified"** — the email-leg root cause |
| F | resend.dev test-domain send | 403 — locked to owner address (expected dead end) |
| G/G2 | DNS (Njalla nameservers) | DKIM present on freebies.; **no SPF TXT** on freebies.; apex SPF is Neo-only |
| H | Both Supabase projects' edge logs for relay calls | **Zero** — the insert branch never executed for either submit |

## Root causes (both proven, not inferred)

1. **Email — the 9/9 "doubled-subdomain repair" was a misdiagnosis.**
   `freebies@freebies.malwaassetfirm.com` was the CORRECT from-address: the
   subdomain is the Resend-verified domain, and the 2026-09-07 probe send in
   Resend's history SUCCEEDED with exactly that from. The "fix" moved FROM_EMAIL
   to the unverified apex → Resend 403'd every send since (probe E).
2. **Insert — invisible failure note + fail-open insert.** The error note
   (`#submit-note`) lives inside `gate-view`, which `submitGate()` hides
   BEFORE the fetch fires — every failure note rendered into a hidden view
   (probe: G confirmed no note seen on two real failures). The insert's
   fail-open design logged to the server console only; response always said
   success. Both of G's submissions silently produced nothing.

## Fixes in this PR

1. **FROM_EMAIL reverted** to the probe-proven verified-subdomain address,
   with the misdiagnosis documented in the comment so it is never "fixed"
   again without verifying the Resend domain list first.
2. **Fail-open insert → honest insertStatus.** The response now carries
   `insertStatus` ∈ {stored, failed, skipped, unconfigured}. Email still
   sends when the insert fails (lead experience preserved), but the state is
   no longer swallowed.
3. **Note moved into results-view** (`#results-note`) — rendered where the
   user actually is after submitting. Handles all three outcomes distinctly:
   stored (no note), sent-but-not-stored (warning with insertStatus), and
   email failure (original wording). Network-catch also renders a note now.
   The old `#submit-note` element remains (harmless, unreferenced by JS).

## Known follow-ups (not this PR)

- **SPF TXT on `freebies.malwaassetfirm.com`** (`v=spf1 include:_resend.spi.resend.com -all`) — G's Njalla paste; DKIM exists but without SPF, receivers may spam-folder Resend mail.
- Insert still didn't fire for G's submits even with `SERVICE_SECRET` set in
  Vercel — likely env not visible to the function (environment scope). The
  new `insertStatus` will name it explicitly (`unconfigured`) on the next
  live submission instead of hiding it.

## Battery

- Inline JS extracted → `node --check` OK; `node --check api/send-playbook.js` OK
- No conflict markers, no stray whitespace in onclick
- `#results-note` wired in 4 places (element, 2 JS paths, catch path)

## Independent review (requesting-code-review pipeline) — PASSED, 5 suggestions folded

Verdict: 0 security / 0 logic errors — all three stated intents verifiably
achieved. Folded (commit 2 on the branch):

1. Unreachable `'skipped'` state removed — state set is now stored/failed/
   unconfigured (every branch is reachable).
2. Insert success now verifies the edge's RESPONSE BODY (`{ok:true}`), not
   just HTTP 200 — closes the in-band-failure hole that could have reported
   'stored' on a silent edge failure (the same class this PR kills).
3. Operator jargon no longer renders to users — the note wording is plain
   ("could not confirm your quiz result was saved").
4. Version-skew wording: a stale backend without insertStatus reads as
   "not confirmed", never a definitive failure claim.
5. Dead `#submit-note` element deleted from the DOM (was unreferenced).