# AI Workflow Audit — Report Template

Internal delivery template for the $1,500 / 1-week AI Workflow Audit.
Copy per engagement to `docs/business/engagements/<client-slug>/report.md`,
fill from the kickoff capture blocks (see `audit-interview-checklist.md`),
and export to PDF for the Day-5 walkthrough. Everything in `<angle
brackets>` gets replaced; delete all guidance blockquotes before delivery.

The filled report is what the offer page promised: the workflow map, the
top-5 plan ranked by hours saved, and the quick-win writeup. Target length
10–20 pages. **Andy reviews the filled report before it goes to the client.**

---

# AI Workflow Audit — <Client Name>

Prepared by Insight Up Solutions · <date>
Engagement: <kickoff date> – <delivery date>

## 1. Executive summary

> 5–8 sentences, written LAST. The three numbers that matter: total hours/mo
> currently going to manual recurring work, hours/mo recoverable via the
> top-5 plan, and hours/mo already coming back from the quick win.

<summary>

**Bottom line: <X> hours/month currently manual → <Y> hours/month
recoverable → <Z> hours/month already automated as of this report.**

## 2. Your workflow map

> The one-page promise. Every recurring process from the kickoff, one row
> each. Hours/mo = time per occurrence x frequency, from THEIR confirmed
> estimates — never invented. Unknown → "<ask client>", not a guess.

| # | Workflow | Owner | Trigger | Freq | Hours/mo | Tools | Where the hours leak |
|---|----------|-------|---------|------|----------|-------|----------------------|
| 1 | <name> | <role> | <event/schedule> | <n>/wk | <n> | <tools> | <retyping, waiting, chasing…> |

**Total recurring manual load: <n> hours/month.**

### Observations

> 3–5 bullets: cross-cutting patterns the table shows — double-entry pairs,
> single-person bottlenecks, tools that don't talk, memory-triggered
> processes that should be schedule-triggered.

## 3. How we ranked the opportunities

Every workflow scored on:

- **Hours saved/month** — from the map, discounted to what automation
  realistically absorbs (a 10 h/mo workflow that still needs human review
  might be a 7 h/mo save; say so)
- **Effort to build** — S (≤1 day) / M (2–5 days) / L (1–2 wks+)
- **Risk** — Low / Med / High: data sensitivity, failure blast radius,
  process stability (don't automate a process that changes monthly)

Rank order: hours saved per unit of effort, risk as tiebreaker. Quick-win
eligibility: S effort + Low risk + visible result.

## 4. Top-5 automation plan

> One block per automation, in rank order. Spec bar: "clear enough to hand
> to any developer" — a competent dev should be able to build from the block
> without a meeting.

### #<n> — <automation name>

| | |
|---|---|
| Replaces | Workflow #<n>: <name> |
| Hours saved | ~<n>/month |
| Effort | S / M / L |
| Risk | Low / Med / High |

**Today:** <2–3 sentences: the manual process and its cost.>

**Automated:** <2–3 sentences: trigger → what runs → output → where the
human stays in the loop, if anywhere.>

**Build spec:** <approach + specific tools/APIs + the integration points.
Name real products and real endpoints, not categories.>

**Prerequisites:** <accounts, API access, data cleanup, plan upgrades.>

## 5. Your quick win — already running

> The offer's differentiator; write it with pride and specificity.

**What we built:** <name + one-paragraph description>

**What it replaces:** Workflow #<n> — previously <n> hours/month.

**How it runs:** <trigger, schedule, where output lands>

**How to check on it / what to do if it breaks:** <plain-language runbook,
who to contact>

**Handover:** <where it lives, what credentials it uses, confirmation that
everything is theirs to keep — no lock-in, no subscription>

## 6. What's next

> Soft, factual, one page max. The follow-on rung: we can build items #2–5,
> or their own developer can, from the specs above. Include indicative
> effort, not prices — pricing conversations happen live with Andy.

<next steps>

## Appendix A — Full workflow inventory

> Capture blocks for everything, including workflows that didn't make the
> top 5 — proof of coverage and raw material for a future engagement.

## Appendix B — Tool inventory

> Every tool they pay for, monthly cost if shared, and which workflows
> touch it. Flag overlap/dead weight if obvious — free value, builds trust.

---

## Filling workflow (internal — delete before delivery)

1. Paste kickoff transcript + capture blocks into Claude with this template;
   have it draft sections 2–4 and both appendices.
2. Verify every hours/mo figure against the client's confirmed estimates —
   the model must not invent numbers; unknowns become clarifying questions.
3. Build the quick win (Days 2–4); write section 5 from what actually shipped.
4. Write section 1 last. Andy reviews the whole document. Export to PDF.
5. Day-5 walkthrough order: section 2 (the "whoa" page) → section 5 (the
   live demo) → section 4 (the plan) → section 6 (the next conversation).
