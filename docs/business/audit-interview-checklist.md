# AI Workflow Audit — Kickoff Interview Checklist

Internal delivery tool for the $1,500 / 1-week AI Workflow Audit
(`/ai-workflow-audit`). Drives the Day-1 90-minute kickoff working session.
Goal: capture enough structured raw material in one call that the model can
synthesize the workflow map and automation ranking with minimal follow-up.

**Total Andy time budget for the whole engagement: ~1 day.** The call is 90
minutes; everything downstream is model synthesis + the quick-win build +
the Day-5 walkthrough. Protect that budget — capture on-call, don't defer.

---

## Before the call

- [ ] Confirm attendees: the **owner** AND the person who **actually does the
      work** (org-chart answers kill audits — you need the real version)
- [ ] Ask client to have ready: list of tools/apps they pay for, and a rough
      headcount by role — nothing else (keep prep friction near zero)
- [ ] Recording set up + **consent to record confirmed at the top of the call**
- [ ] Open a fresh capture doc from the template below (one block per workflow)
- [ ] Review their inquiry-form message — they told you where it hurts; start there

## The 90 minutes

### 0–10 min — Frame + business snapshot

- What the week looks like: agenda, the three deliverables, when they hear
  from us again (clarifying questions Days 2–4, walkthrough Day 5)
- Capture: business model in one sentence, headcount by role, revenue rhythm
  (project / recurring / seasonal), the tool list

### 10–60 min — Workflow walkthrough (the core)

Walk the business chronologically: "Take me through what happens from the
moment a customer first contacts you to the moment you get paid." Then sweep
the back office: bookkeeping, scheduling, hiring, reporting, compliance.

For **every recurring process** that surfaces, fill one capture block:

```
Workflow: <name>
Owner: <who does it — person/role>
Trigger: <what starts it — event, schedule, someone remembers>
Frequency: <per day/week/month>
Time per occurrence: <their estimate — push for a real number>
Steps: <numbered, in their words>
Tools touched: <every app, spreadsheet, inbox, paper form>
Handoffs/waits: <where it sits waiting on a person>
Failure mode: <what goes wrong, how often, cost when it does>
Skip test: <what breaks if nobody does this for 2 weeks>
```

Probing questions that surface the leaks:

- "Where does information get retyped from one system into another?"
- "What do you do every single week that feels like it should do itself?"
- "What's the last thing that fell through the cracks? Walk me through it."
- "If you hired someone tomorrow, what would you hand them first?"
- "What report or answer do you wish you had every Monday morning?"
- "Where do customers wait on you when they shouldn't have to?"

Target: **8–15 workflow blocks**. Fewer than 8 → you're getting the org
chart, dig into a specific recent week. The map promises "every recurring
process on one page" — coverage matters more than depth here.

### 60–75 min — Pain ranking

Have them rank, out loud:

- Which workflow eats the most hours?
- Which is most error-prone?
- Which do they personally hate most? (owner-hated tasks stall businesses)
- Confirm their time estimates: "You said invoicing is ~30 min each — how
  many last month?" (the map's hours/month numbers come from this)

### 75–90 min — Quick-win candidates + logistics

- Flag 2–3 quick-win candidates *with them* (builds Day-5 buy-in). Criteria:
  buildable in ~half a day, no risky data migration, visible hours back,
  touches tools with sane APIs or export paths
- Access: what credentials/exports/API keys will the build need, and who
  provides them **by end of Day 2**
- Book the Day-5 delivery walkthrough call before hanging up
- Set expectations: "You'll get a couple of clarifying questions from me by
  Day 3 — fast answers keep your quick win on schedule"

## After the call (same day)

- [ ] Transcript + capture blocks → model synthesis: draft workflow map table
      and scoring per `audit-report-template.md`
- [ ] List open gaps as clarifying questions; send in ONE batched message
- [ ] Pick the quick win (from the flagged candidates; if none survives
      technical scrutiny, pick the next-best and tell the client why)
- [ ] Log the engagement + all touch dates in `docs/business/pipeline.md`

## Scope guards

- **Price is fixed.** If they ask for a discount or extras in-call: "Let me
  log that and come back to you" — log it, escalate to Andy, never discount
  in writing on the spot.
- **One quick win.** Additional builds are the follow-on engagement — say
  exactly that; it's the upsell, not scope creep.
- **No promises on impact numbers** until the map is built — "that's what
  the audit answers."
