# Day 16 Agent Handoff — Condition Trace V4

Use this file when continuing Condition Trace from another conversation or coding agent.

## Source of truth

Repository: `Faadil1/day16-condition-trace`

Current promoted branch:

```text
main
```

Current direction:

```text
Evidence in Motion V4
```

Do not continue from the old V3 Smoky Patina branch as if it were current. V3 is now historical design documentation.

## Read these files first

1. `README.md` — current product contract and release state.
2. `docs/V4_EVIDENCE_IN_MOTION.md` — current V4 interaction/design contract.
3. `docs/UIUX_WORKFLOW_CANONICAL.md` — reusable design rules.
4. `docs/TRACE_WORKFLOW_SYSTEM.md` — TRACE architecture.
5. `docs/POSTMORTEM_CONDITION_TRACE_V3.md` — historical lessons only.
6. `docs/VIDEO_DEMO_GUIDE.md` — original video strategy; verify against current V4 before using.

Before modifying proof-bearing behavior, inspect the current React components and `src/styles/evidence-in-motion-v4.css`.

---

# Current product contract

Condition Trace is a conservation evidence workflow for establishing the **first documented appearance** of a surface feature across non-equivalent records.

Canonical conclusion:

- first documented appearance: **Aug 3, 2026**;
- prior records use diffuse-light documentation;
- the return-arrival record adds raking light;
- earlier documentation is not an equivalent examination;
- prior physical absence therefore **cannot be confirmed**;
- no cause, exact physical timing, responsibility, or liability determination is made.

Never upgrade the finding beyond the evidence.

---

# Frozen / high-confidence layers

Treat these as frozen unless a concrete bug is found:

- canonical vessel identity;
- upper-right-shoulder hairline feature;
- raking-light examination logic;
- OBS-04 captured observation pipeline;
- honest Compare logic;
- evidence lineage:
  `SRC-03 → OBS-04 → CMP-01 → LIM-01 → FND-01`;
- qualified finding language;
- Evidence Record content;
- responsive baseline;
- reduced-motion behavior.

---

# V4 interaction laws

1. **Evidence has continuity.**
2. **Light is the instrument.**
3. **Evidence has resistance.**
4. **Archive closes the loop.**

Signature interaction hierarchy:

1. raking-light reveal;
2. OBS-04 preservation;
3. evidence continuity through Compare;
4. animated evidence lineage;
5. Finding → Record collapse;
6. hold-to-seal finalization.

Do not add effects that do not perform a product job.

---

# Current implementation landmarks

Key files include:

- `src/components/AppShell.tsx`
- `src/components/ObjectStage.tsx`
- `src/components/ComparisonView.tsx`
- `src/components/EvidenceLineage.tsx`
- `src/components/GeneratedRecord.tsx`
- `src/components/HoldToSealButton.tsx`
- `src/hooks/useEditorialMotion.ts`
- `src/styles/evidence-in-motion-v4.css`

The V4 browser QA flow exists to validate the visual states deterministically.

---

# Current release state

V4 is promoted to `main`.

Production URL:

```text
https://day16-condition-trace.vercel.app
```

The Phase II comeback film is a publishing artifact layered on top of the live product. Do not treat edited video as stronger evidence than the deployed interaction.

For social/demo work, preserve this hierarchy:

```text
real product behavior
→ deterministic capture
→ editorial cut
→ narration / sound design
```

Never fabricate a product behavior in post.

---

# If continuing the project

The next work should be additive and release-oriented, not another wholesale redesign.

Good next tasks:

- polish repository/public case-study documentation;
- refresh showcase screenshots from the current V4 runtime;
- maintain production proof;
- package social/portfolio assets;
- collect post-release feedback;
- only reopen product design if a concrete usability or evidence problem appears.

Avoid reopening V3-vs-V4 aesthetic exploration without a real problem.
