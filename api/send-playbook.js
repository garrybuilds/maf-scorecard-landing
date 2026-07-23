// Vercel serverless function: /api/send-playbook
// Receives lead capture, stores in Supabase, sends playbook via Resend

const SUPABASE_URL = "https://cfrlknbpfzpkwpqodmfr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_YbLmE87tR1J0EFD2S7ueeA_RTWjKXMD";
const RESEND_API_KEY = "re_GF7N534Q_JVWJjeuup1aDAEXZTgJRjdfd";
const FROM_EMAIL = "MAF Deploy <onboarding@resend.dev>";

const playbooks = {
  demand: {
    subject: "Your Demand Playbook — how to fix your lead flow",
    html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#1c1c1c;background:#f7f4ee;">
<div style="font-size:0.85rem;color:#c47a38;margin-bottom:28px;">Malwa Asset Firm</div>
<h1 style="font-size:1.6rem;font-weight:400;line-height:1.2;margin-bottom:8px;">Your Binding Constraint: <em style="color:#c47a38;">Demand</em></h1>
<p style="color:#5c5c5c;margin-bottom:32px;">You don't have enough qualified leads to fill capacity. Here's how to fix it — broken down by industry, with specific benchmarks and a step-by-step plan.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">How This Shows Up</h2>
<p style="color:#5c5c5c;line-height:1.65;">Trucks sit idle 2-3 days a week. Revenue is flat despite good reviews. You're dependent on one lead source. The owner is the only person generating leads.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">How It Plays Out by Industry</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>HVAC:</strong> Highest lead volume requirement. 60% of annual revenue in 4 months. Shops that survive have maintenance agreements creating off-season demand.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Plumbing:</strong> More consistent year-round. Emergency calls are high-margin but unpredictable.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Electrical:</strong> Lowest volume, highest ticket. Problem is lead quality, not quantity.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">The Most Common Mistakes</h2>
<ol style="color:#5c5c5c;line-height:1.8;">
<li>Over-relying on one channel (60%+ from one source = revenue cliff)</li>
<li>Underinvesting in marketing (benchmark: 3% of revenue)</li>
<li>Treating all leads the same</li>
<li>No lead tracking by source</li>
<li>The owner is the marketing department</li>
</ol>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">The Fix: Step by Step</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 1:</strong> Audit your current lead sources — pull 12 months of data, categorize every job by source.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 2:</strong> Fix your Google Business Profile — free, 2 hours, 7× more clicks.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 3:</strong> Build a second channel — Google LSA if word-of-mouth is dominant, referral program if Google is dominant.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 4:</strong> Set a marketing budget — 3% of trailing 12-month revenue.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 5:</strong> Hire or outsource marketing operations at $3M+.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">Do's and Don'ts</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Do:</strong> Track cost per lead and close rate by source monthly. Diversify to at least 3 meaningful lead sources. Invest in SEO early. Use Google LSA as a bridge. Ask every customer how they heard about you.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Don't:</strong> Put all budget into one platform. Chase cheap leads that never close. Ignore your Google Business Profile. Wait until revenue drops to start marketing.</p>

<div style="margin-top:40px;padding:28px;background:#fff;border:1px solid #c47a38;border-radius:6px;text-align:center;">
<h3 style="font-size:1.1rem;font-weight:400;margin-bottom:6px;">Want the full 6-Vector Roadmap?</h3>
<p style="color:#5c5c5c;font-size:0.9rem;margin-bottom:16px;">This guide covers one constraint. A Growth Blocker Analysis covers all six — I pressure-test your scores against 400+ service business benchmarks and give you a complete growth roadmap in 30 minutes.</p>
<a href="https://cal.com/malwa-asset-firm/growth-blocker-analysis" style="display:inline-block;padding:14px 36px;background:#c47a38;color:#fff;border-radius:6px;text-decoration:none;font-weight:700;">Book a Growth Blocker Analysis →</a>
</div>

<div style="margin-top:32px;padding-top:20px;border-top:1px solid #e4ded4;text-align:center;font-size:0.75rem;color:#949494;">Malwa Asset Firm</div>
</div>`
  },
  conversion: {
    subject: "Your Conversion Playbook — how to close more of the leads you already have",
    html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#1c1c1c;background:#f7f4ee;">
<div style="font-size:0.85rem;color:#c47a38;margin-bottom:28px;">Malwa Asset Firm</div>
<h1 style="font-size:1.6rem;font-weight:400;line-height:1.2;margin-bottom:8px;">Your Binding Constraint: <em style="color:#c47a38;">Conversion</em></h1>
<p style="color:#5c5c5c;margin-bottom:32px;">Leads come in but don't convert. You're losing revenue between inquiry and close. Here's how to fix it.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">How This Shows Up</h2>
<p style="color:#5c5c5c;line-height:1.65;">You're spending on leads but revenue isn't growing. Close rate below 30%. Leads go dark after the first call. The owner or one person closes everything.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">How It Plays Out by Industry</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>HVAC:</strong> Widest close rate range (30-42%). Biggest killer: slow response time. Leads contacted within 5 min are 21× more likely to qualify.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Plumbing:</strong> Highest close rate (41.5%) but only 27-31% of phone leads are ever contacted.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Electrical:</strong> High close rate (43.4%) but the problem is upsell — a $150 outlet call should become a $4,000 panel upgrade.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">The Most Common Mistakes</h2>
<ol style="color:#5c5c5c;line-height:1.8;">
<li>Slow response time (industry avg: 14+ hours)</li>
<li>No follow-up on unsold estimates (top shops recover 11-15% of revenue here)</li>
<li>The owner is the only closer</li>
<li>No contact tracking</li>
<li>Pricing conversations happen too early</li>
</ol>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">The Fix: Step by Step</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 1:</strong> Measure speed-to-lead — timestamp every inbound lead for one week.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 2:</strong> Automate the first response — auto-responders double contact rate.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 3:</strong> Build a follow-up sequence — Day 1 email, Day 3 text, Day 7 call, Day 14 final email.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 4:</strong> Train someone else to close — record your best calls, have them shadow, then take 20% of calls.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 5:</strong> Track contact rate and close rate by source monthly.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">Do's and Don'ts</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Do:</strong> Respond within 5 minutes. Follow up on every unsold estimate 3×. Record and review sales calls weekly. Track close rate by source. Train at least one other closer.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Don't:</strong> Let leads sit for hours. Send one estimate and hope. Give pricing before establishing value. Let the owner be the only closer.</p>

<div style="margin-top:40px;padding:28px;background:#fff;border:1px solid #c47a38;border-radius:6px;text-align:center;">
<h3 style="font-size:1.1rem;font-weight:400;margin-bottom:6px;">Want the full 6-Vector Roadmap?</h3>
<p style="color:#5c5c5c;font-size:0.9rem;margin-bottom:16px;">This guide covers one constraint. A Growth Blocker Analysis covers all six — I pressure-test your scores against 400+ service business benchmarks and give you a complete growth roadmap in 30 minutes.</p>
<a href="https://cal.com/malwa-asset-firm/growth-blocker-analysis" style="display:inline-block;padding:14px 36px;background:#c47a38;color:#fff;border-radius:6px;text-decoration:none;font-weight:700;">Book a Growth Blocker Analysis →</a>
</div>

<div style="margin-top:32px;padding-top:20px;border-top:1px solid #e4ded4;text-align:center;font-size:0.75rem;color:#949494;">Malwa Asset Firm</div>
</div>`
  },
  delivery: {
    subject: "Your Delivery Playbook — how to fulfill without chaos",
    html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#1c1c1c;background:#f7f4ee;">
<div style="font-size:0.85rem;color:#c47a38;margin-bottom:28px;">Malwa Asset Firm</div>
<h1 style="font-size:1.6rem;font-weight:400;line-height:1.2;margin-bottom:8px;">Your Binding Constraint: <em style="color:#c47a38;">Delivery</em></h1>
<p style="color:#5c5c5c;margin-bottom:32px;">You have jobs but can't fulfill them without chaos. The "ghost truck" problem — trucks generating $130-160K when they should be at $310K+. Here's how to fix it.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">How This Shows Up</h2>
<p style="color:#5c5c5c;line-height:1.65;">Owner spends 20+ hours/week on scheduling and dispatch. Revenue per truck under $200K. First-time fix rate below 70%. Scheduling is on a whiteboard or memory. Jobs get missed or double-booked.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">How It Plays Out by Industry</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>HVAC:</strong> Scheduling complexity — system replacements (4-8 hrs) vs repairs (1-2 hrs) vs emergencies. Without digital scheduling, the dispatcher is playing Tetris blindfolded.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Plumbing:</strong> Parts and inventory — techs driving 45 min to supply houses is the #1 margin killer.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Electrical:</strong> Permitting and inspection bottlenecks — jobs sit in limbo for weeks waiting for inspections.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">The Most Common Mistakes</h2>
<ol style="color:#5c5c5c;line-height:1.8;">
<li>No digital scheduling system</li>
<li>The owner is the dispatcher</li>
<li>No parts management — supply house runs during jobs</li>
<li>No first-time fix tracking</li>
<li>Revenue per truck isn't measured</li>
</ol>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">The Fix: Step by Step</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 1:</strong> Move to digital scheduling — ServiceTitan, Housecall Pro, or Jobber. 30-40% fewer errors.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 2:</strong> Track first-time fix rate for one week. Fix the top reason for callbacks.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 3:</strong> Stock trucks properly — audit what parts techs most commonly need.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 4:</strong> Hire a dispatcher at 5+ trucks — owner's time is worth $200-500/hr on growth.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 5:</strong> Set revenue-per-truck targets — HVAC: $310K min, Plumbing: $250K, Electrical: $200K.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">Do's and Don'ts</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Do:</strong> Use digital scheduling even for 3 trucks. Track first-time fix rate weekly. Stock common parts on every truck. Measure revenue per truck monthly. Hire dispatch before 5 trucks.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Don't:</strong> Let the owner dispatch past $3M. Tolerate supply house runs as normal. Add trucks before fixing scheduling.</p>

<div style="margin-top:40px;padding:28px;background:#fff;border:1px solid #c47a38;border-radius:6px;text-align:center;">
<h3 style="font-size:1.1rem;font-weight:400;margin-bottom:6px;">Want the full 6-Vector Roadmap?</h3>
<p style="color:#5c5c5c;font-size:0.9rem;margin-bottom:16px;">This guide covers one constraint. A Growth Blocker Analysis covers all six — I pressure-test your scores against 400+ service business benchmarks and give you a complete growth roadmap in 30 minutes.</p>
<a href="https://cal.com/malwa-asset-firm/growth-blocker-analysis" style="display:inline-block;padding:14px 36px;background:#c47a38;color:#fff;border-radius:6px;text-decoration:none;font-weight:700;">Book a Growth Blocker Analysis →</a>
</div>

<div style="margin-top:32px;padding-top:20px;border-top:1px solid #e4ded4;text-align:center;font-size:0.75rem;color:#949494;">Malwa Asset Firm</div>
</div>`
  },
  cashflow: {
    subject: "Your Cash Flow Playbook — how to collect what you earn",
    html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#1c1c1c;background:#f7f4ee;">
<div style="font-size:0.85rem;color:#c47a38;margin-bottom:28px;">Malwa Asset Firm</div>
<h1 style="font-size:1.6rem;font-weight:400;line-height:1.2;margin-bottom:8px;">Your Binding Constraint: <em style="color:#c47a38;">Cash Flow</em></h1>
<p style="color:#5c5c5c;margin-bottom:32px;">You do the work but don't collect efficiently. You're financing your customers' projects with your own cash. Here's how to fix it.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">How This Shows Up</h2>
<p style="color:#5c5c5c;line-height:1.65;">DSO above 45 days. Borrowing from a line of credit to make payroll every month. Invoices go out 2-4 weeks after job completion. Less than 75% of AR is current. Bad debt write-offs exceed 3%.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">How It Plays Out by Industry</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>HVAC:</strong> Best cash flow profile — most work paid at completion. Problem is commercial work (net 30-60) and service contracts billing monthly.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Plumbing:</strong> Service work paid immediately. Problem is new construction/remodel where GCs pay net 30-60.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Electrical:</strong> Material costs — $1,500 in materials paid upfront but not collected for 30-60 days.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">The Most Common Mistakes</h2>
<ol style="color:#5c5c5c;line-height:1.8;">
<li>Paper invoicing — adds 2-4 weeks to collection cycle</li>
<li>No payment terms enforcement — "net 30" means net 45-60</li>
<li>Invoicing delays — 2-4 weeks after job completion</li>
<li>No progress billing on large jobs</li>
<li>No AR aging review</li>
</ol>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">The Fix: Step by Step</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 1:</strong> Switch to electronic invoicing — cuts DSO by 6-10 days immediately.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 2:</strong> Set up automated payment reminders — Day 15, Day 30, Day 45.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 3:</strong> Invoice within 48 hours of job completion.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 4:</strong> Implement progress billing on jobs over $5,000 — 30% deposit, 30% midpoint, 40% completion.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 5:</strong> Review AR aging weekly — anything over 45 days gets a call.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">Do's and Don'ts</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Do:</strong> Use electronic invoicing with automated reminders. Invoice within 48 hours. Require deposits on jobs over $5K. Review AR aging weekly. Charge and enforce late fees.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Don't:</strong> Mail paper invoices. Let invoicing pile up. Finance large jobs without progress billing. Ignore AR over 60 days.</p>

<div style="margin-top:40px;padding:28px;background:#fff;border:1px solid #c47a38;border-radius:6px;text-align:center;">
<h3 style="font-size:1.1rem;font-weight:400;margin-bottom:6px;">Want the full 6-Vector Roadmap?</h3>
<p style="color:#5c5c5c;font-size:0.9rem;margin-bottom:16px;">This guide covers one constraint. A Growth Blocker Analysis covers all six — I pressure-test your scores against 400+ service business benchmarks and give you a complete growth roadmap in 30 minutes.</p>
<a href="https://cal.com/malwa-asset-firm/growth-blocker-analysis" style="display:inline-block;padding:14px 36px;background:#c47a38;color:#fff;border-radius:6px;text-decoration:none;font-weight:700;">Book a Growth Blocker Analysis →</a>
</div>

<div style="margin-top:32px;padding-top:20px;border-top:1px solid #e4ded4;text-align:center;font-size:0.75rem;color:#949494;">Malwa Asset Firm</div>
</div>`
  },
  retention: {
    subject: "Your Retention Playbook — how to make customers come back",
    html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#1c1c1c;background:#f7f4ee;">
<div style="font-size:0.85rem;color:#c47a38;margin-bottom:28px;">Malwa Asset Firm</div>
<h1 style="font-size:1.6rem;font-weight:400;line-height:1.2;margin-bottom:8px;">Your Binding Constraint: <em style="color:#c47a38;">Retention</em></h1>
<p style="color:#5c5c5c;margin-bottom:32px;">Customers don't come back. You're running on a treadmill — constantly refilling the top of the funnel because customers leave out the bottom. Here's how to fix it.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">How This Shows Up</h2>
<p style="color:#5c5c5c;line-height:1.65;">Repeat customer rate below 35%. Less than 20% on maintenance plans. Fewer than 10 reviews or rating below 4.0. 70%+ of marketing budget on new customer acquisition. Customers who used you once call a competitor next time.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">How It Plays Out by Industry</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>HVAC:</strong> Highest repeat potential — systems need service 2×/year. Plan members retain at 74-89% and have 2.3× higher lifetime value.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Plumbing:</strong> Event-driven demand — the retention play is being top-of-mind when the event happens (fridge magnets, seasonal postcards, Google dominance).</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Electrical:</strong> Lowest repeat rate (29%) — the play is cross-selling: panel upgrade → EV charger → generator → surge protector.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">The Most Common Mistakes</h2>
<ol style="color:#5c5c5c;line-height:1.8;">
<li>No maintenance plan — the single highest-ROI move in the trades</li>
<li>No follow-up after the job — 52% of non-returns are communication failures</li>
<li>No review system — 42% of consumers won't use a business that never replies to reviews</li>
<li>Treating every customer as a one-time transaction</li>
<li>No seasonal touchpoints</li>
</ol>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">The Fix: Step by Step</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 1:</strong> Launch a maintenance plan — annual tune-up + priority scheduling + 10% discount. $150-250/year.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 2:</strong> Set up a review request system — text/email after every job with a direct Google review link.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 3:</strong> Build a seasonal touchpoint calendar — 4 touches/year per customer.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 4:</strong> Create a "we haven't seen you" campaign — email lapsed customers with a $25 offer.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 5:</strong> Train techs to identify cross-sell opportunities.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">Do's and Don'ts</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Do:</strong> Launch a maintenance plan — even a simple one. Ask every customer for a review. Send seasonal touchpoints 4×/year. Run a "we haven't seen you" campaign quarterly. Train techs to cross-sell.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Don't:</strong> Assume good work = repeat customers. Ignore reviews. Let customers go 12+ months without hearing from you.</p>

<div style="margin-top:40px;padding:28px;background:#fff;border:1px solid #c47a38;border-radius:6px;text-align:center;">
<h3 style="font-size:1.1rem;font-weight:400;margin-bottom:6px;">Want the full 6-Vector Roadmap?</h3>
<p style="color:#5c5c5c;font-size:0.9rem;margin-bottom:16px;">This guide covers one constraint. A Growth Blocker Analysis covers all six — I pressure-test your scores against 400+ service business benchmarks and give you a complete growth roadmap in 30 minutes.</p>
<a href="https://cal.com/malwa-asset-firm/growth-blocker-analysis" style="display:inline-block;padding:14px 36px;background:#c47a38;color:#fff;border-radius:6px;text-decoration:none;font-weight:700;">Book a Growth Blocker Analysis →</a>
</div>

<div style="margin-top:32px;padding-top:20px;border-top:1px solid #e4ded4;text-align:center;font-size:0.75rem;color:#949494;">Malwa Asset Firm</div>
</div>`
  },
  support: {
    subject: "Your Support Playbook — how to handle issues without bottlenecking the owner",
    html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#1c1c1c;background:#f7f4ee;">
<div style="font-size:0.85rem;color:#c47a38;margin-bottom:28px;">Malwa Asset Firm</div>
<h1 style="font-size:1.6rem;font-weight:400;line-height:1.2;margin-bottom:8px;">Your Binding Constraint: <em style="color:#c47a38;">Support</em></h1>
<p style="color:#5c5c5c;margin-bottom:32px;">Customer issues pile up with no system. The owner is the bottleneck for every complaint. Here's how to fix it.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">How This Shows Up</h2>
<p style="color:#5c5c5c;line-height:1.65;">Every complaint goes to the owner. No ticket system — issues tracked in texts and voicemails. First-call resolution below 70%. Issues take 24+ hours for a response. Negative reviews never responded to. Owner spends 10+ hours/week putting out fires.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">How It Plays Out by Industry</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>HVAC:</strong> Post-installation issues — new system not working right, thermostat confusion. Most resolvable by trained office staff over the phone.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Plumbing:</strong> Emergencies — leak after repair, clog came back. Speed matters more than anything.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Electrical:</strong> Safety-related — sparks, burning smells, breakers tripping. Need immediate triage: emergency now or schedule tomorrow?</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">The Most Common Mistakes</h2>
<ol style="color:#5c5c5c;line-height:1.8;">
<li>No ticket system — issues fall through cracks</li>
<li>The owner handles everything — single point of failure</li>
<li>No response to negative reviews — permanent advertisement that you don't care</li>
<li>No escalation process — every issue becomes an owner issue</li>
<li>No root cause tracking — treating symptoms instead of fixing causes</li>
</ol>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">The Fix: Step by Step</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 1:</strong> Set up a ticket system — even a shared Google Sheet is better than nothing.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 2:</strong> Create a triage decision tree — write down the 10 most common issues and who handles each.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 3:</strong> Set response time standards — Emergency: 15 min, Urgent: 1 hr, Standard: 4 hrs.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 4:</strong> Respond to every review from the last 90 days — positive and negative.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Step 5:</strong> Track issue types and fix root causes — pick the top issue monthly and eliminate it permanently.</p>

<h2 style="font-size:1.1rem;font-weight:400;margin-top:28px;">Do's and Don'ts</h2>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Do:</strong> Log every issue in a ticket system. Create a triage decision tree. Set response time standards. Respond to every review within 48 hours. Fix root causes, not symptoms.</p>
<p style="color:#5c5c5c;line-height:1.65;"><strong>Don't:</strong> Let issues live in texts and voicemails. Make the owner the default for every complaint. Ignore negative reviews. Wait until 10+ trucks to build a support system.</p>

<div style="margin-top:40px;padding:28px;background:#fff;border:1px solid #c47a38;border-radius:6px;text-align:center;">
<h3 style="font-size:1.1rem;font-weight:400;margin-bottom:6px;">Want the full 6-Vector Roadmap?</h3>
<p style="color:#5c5c5c;font-size:0.9rem;margin-bottom:16px;">This guide covers one constraint. A Growth Blocker Analysis covers all six — I pressure-test your scores against 400+ service business benchmarks and give you a complete growth roadmap in 30 minutes.</p>
<a href="https://cal.com/malwa-asset-firm/growth-blocker-analysis" style="display:inline-block;padding:14px 36px;background:#c47a38;color:#fff;border-radius:6px;text-decoration:none;font-weight:700;">Book a Growth Blocker Analysis →</a>
</div>

<div style="margin-top:32px;padding-top:20px;border-top:1px solid #e4ded4;text-align:center;font-size:0.75rem;color:#949494;">Malwa Asset Firm</div>
</div>`
  }
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, constraint_id, scores } = req.body;

    if (!name || !email || !constraint_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Store in Supabase
    const supabaseRes = await fetch(`${SUPABASE_URL}/rest/v1/lead_captures`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ name, email, constraint_id, scores })
    });

    if (!supabaseRes.ok) {
      console.error('Supabase insert failed:', await supabaseRes.text());
      // Don't fail the whole request — still try to send email
    }

    // 2. Send playbook via Resend
    const playbook = playbooks[constraint_id];
    if (playbook) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [email],
          subject: playbook.subject,
          html: playbook.html
        })
      });

      if (!resendRes.ok) {
        console.error('Resend send failed:', await resendRes.text());
        return res.status(500).json({ error: 'Failed to send email' });
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
