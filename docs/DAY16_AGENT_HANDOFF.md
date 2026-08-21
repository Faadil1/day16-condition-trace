# Day 16 Agent Handoff — Condition Trace V3

Use this file when continuing Condition Trace from another conversation or coding agent.

## Source of truth

Repository: `Faadil1/day16-condition-trace`

Current V3 working branch:

```text
design/uiux-v3-smoky-patina
```

Do not assume `main` contains the latest V3 design until an explicit promotion/merge has occurred.

## Read these files first, in order

1. `README.md` — product purpose and limitations.
2. `docs/UIUX_WORKFLOW_CANONICAL.md` — reusable design rules and Condition Trace adapter.
3. `docs/TRACE_WORKFLOW_SYSTEM.md` — TRACE architecture and how gates/tools are organized.
4. `docs/POSTMORTEM_CONDITION_TRACE_V3.md` — what worked, what failed, what was promoted into the workflow.
5. `docs/VIDEO_DEMO_GUIDE.md` — exact showcase-film strategy and shot list.

Before modifying proof-bearing behavior, inspect the current React components and V3 CSS rather than relying on older screenshots or memory.

---

# Current product contract

Condition Trace is a conservation evidence workflow for establishing the **first documented appearance** of a surface feature across non-equivalent records.

Canonical conclusion:
- first documented appearance: **Aug 3, 2026**;
- prior records are diffuse-light documentation and do not provide an equivalent raking-light comparison;
- prior physical absence therefore **cannot be confirmed**;
- no cause, exact physical timing or liability determination is made.

If any proposed design/video copy strengthens these claims, stop and reopen the Proof Contract instead of silently changing them.

---

# Frozen / high-confidence product layers

Treat these as frozen unless a real bug is found:

- Canonical Vessel V2 geometry/material identity.
- Upper-right-shoulder hairline feature behavior.
- Grazing-light/raking-light examination logic.
- OBS-04 captured observation pipeline.
- Honest Compare A/B logic.
- Evidence lineage:
  `SRC-03 → OBS-04 → CMP-01 → LIM-01 → FND-01`
- Qualified finding language.
- Evidence Record content/export logic.
- Responsive baseline and reduced-motion behavior.

Visual polish may change presentation but should not rewrite these facts.

---

# Current V3 art direction

Name: **Smoky Patina Archive**

Core palette:
- smoky blue-green anchor: `#24363A`
- patina green: `#3F5B53`
- parchment: `#F0E4CF`
- charcoal: `#1D2324`
- bronze evidence/action: `#B78455`
- stone blue: `#708B94`

Typography:
- Newsreader — editorial/display
- Manrope — reading/UI
- DM Mono — IDs, dates, states, technical notation

Typography was explicitly re-audited late in V3. Do not reintroduce 5–8px readable content. Microtype is reserved for non-essential identifiers.

---

# Signature interaction hierarchy

1. **Raking-light examination** — primary signature / strongest wow moment.
2. **Evidence Trace** — Anime.js + SVG lineage animation.
3. **Finding → Evidence Record** — resolution signature.
4. **Archive record selection** — moving bronze selection mark.
5. **OBS-04 preservation seal** — short capture micro-interaction.

Do not add another major effect unless it performs a genuinely new product job. More motion is not automatically more unique.

---

# Technology ownership

- Three.js / React Three Fiber — object, camera, lighting, spatial examination.
- Anime.js — editorial choreography, SVG evidence path, staged sequences.
- Motion / Framer Motion — React transitions, layout motion, record-selection movement.
- React Bits / Magic UI — reference sources only unless a component solves a real job.
- Rive — not currently needed.
- KokonutUI Liquid Glass — intentionally rejected for this visual direction.
- Bklit — not relevant to this workflow.

---

# Next recommended task: final showcase video

Do **not** begin by redesigning the application again.

Read `docs/VIDEO_DEMO_GUIDE.md` and use the hybrid route:

1. capture real V3 footage for all proof-bearing interactions;
2. create a separate `/video` Remotion project only if a cinematic edit is desired;
3. use Remotion for timing, crops, titles, transition logic and final end card;
4. keep Three.js proof shots sourced from the canonical application whenever possible.

The final film should follow:

```text
Open → Records → Raking-light Inspect → OBS-04 Preserve → Compare → Evidence Trace → Finding → Evidence Record
```

Target master:
- 1920×1080
- 30fps
- ~38–45 seconds

---

# Suggested first prompt for a coding agent

```text
We are continuing Condition Trace Day 16 on branch design/uiux-v3-smoky-patina.
Before changing anything, read README.md, docs/UIUX_WORKFLOW_CANONICAL.md,
docs/TRACE_WORKFLOW_SYSTEM.md, docs/POSTMORTEM_CONDITION_TRACE_V3.md,
and docs/VIDEO_DEMO_GUIDE.md.

Treat the canonical proof logic and current V3 design as frozen unless you find a concrete bug.
Our next task is the final showcase film. Build from the hybrid strategy in VIDEO_DEMO_GUIDE.md:
real application capture for proof-bearing moments, Remotion for edit/choreography, and no fabricated evidence.
First return a concise capture plan and proposed file structure. Do not modify the app until that plan is reviewed.
```

---

# Completion criteria for the video phase

The video phase is complete only when:
- the real raking-light examination is visible;
- OBS-04 preservation is visible;
- Compare visibly preserves the documentation gap;
- the Evidence Trace is understandable;
- FND-01 resolves into the Evidence Record;
- the limitation remains clear;
- text is readable at normal playback scale;
- the film does not suggest automatic detection, cause or liability;
- the final video accurately represents what the live app can do.
