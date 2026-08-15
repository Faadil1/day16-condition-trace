# Condition Trace

**Day 16 of “30 Days of Real Business Problems”**

## Live Demo

Production:
[https://day16-condition-trace.vercel.app](https://day16-condition-trace.vercel.app)

> The current **Smoky Patina Archive V3** is developed on `design/uiux-v3-smoky-patina`. Do not assume production/main contains the latest V3 until the branch is explicitly promoted.

## GitHub

[https://github.com/Faadil1/day16-condition-trace](https://github.com/Faadil1/day16-condition-trace)

> All institutions, objects, and records are fictional.
> The system identifies the **first documented appearance** of a feature in the record chain — not physical cause or liability.

---

## Purpose

Condition Trace helps a conservator or trained registrar review the documentation chain for a museum object returned from loan. It brings condition reports, examination conditions, evidence status, handoff moments and a human-reviewed captured observation into one traceable workflow.

## Business problem and reframe

When a newly observed condition feature appears during return inspection, evidence is often distributed across institutions and records. The product does not determine where physical damage occurred or who is responsible.

The professional reframe is:

**do not trace where the damage occurred; trace when the feature first appears in the documentation record.**

## Canonical workflow

```text
Open → Records → Inspect → Compare → Finding → Record
```

Evidence lineage:

```text
SRC-03 → OBS-04 → CMP-01 → LIM-01 → FND-01
```

Canonical conclusion:
- first documented appearance: **Aug 3, 2026**;
- earlier diffuse-light records are not equivalent to the Aug 3 raking-light observation;
- prior physical absence therefore cannot be confirmed;
- no cause, exact moment of damage or liability determination is made.

---

# V3 — Smoky Patina Archive

The V3 design direction intentionally combines contemporary museum/archive materiality with a conservation-instrument interaction model.

Core visual language:
- smoky blue-green and patina environment;
- parchment reserved for documentary artifacts;
- bronze reserved for evidence/action signals;
- Newsreader for editorial voice;
- Manrope for readable UI;
- DM Mono for IDs and technical notation.

Signature interaction hierarchy:
1. raking-light examination — Three.js / React Three Fiber;
2. animated Evidence Trace — Anime.js + SVG;
3. Finding → Evidence Record resolution;
4. archive record-selection micro-interaction;
5. OBS-04 preservation seal.

The design deliberately avoids generic AI aesthetics such as gratuitous glassmorphism, neon holograms and decorative animated effects with no product job.

---

# TRACE design workflow documentation

Condition Trace also became the proving ground for a reusable product/design workflow called **TRACE**:

- **T — Truth**
- **R — Research & References**
- **A — Art Direction & Architecture**
- **C — Character & Construction**
- **E — Evaluation & Evolution**

Important project documents:

- [`docs/UIUX_WORKFLOW_CANONICAL.md`](docs/UIUX_WORKFLOW_CANONICAL.md) — canonical gates, tools and anti-slop rules.
- [`docs/TRACE_WORKFLOW_SYSTEM.md`](docs/TRACE_WORKFLOW_SYSTEM.md) — Workflow Kernel, Project Adapter and Tool Adapter architecture.
- [`docs/POSTMORTEM_CONDITION_TRACE_V3.md`](docs/POSTMORTEM_CONDITION_TRACE_V3.md) — design post-mortem and promoted lessons.
- [`docs/VIDEO_DEMO_GUIDE.md`](docs/VIDEO_DEMO_GUIDE.md) — final screen-live / Remotion showcase strategy.
- [`docs/DAY16_AGENT_HANDOFF.md`](docs/DAY16_AGENT_HANDOFF.md) — continuity handoff for another conversation or coding agent.

If an agent is continuing Day 16, start with `docs/DAY16_AGENT_HANDOFF.md`.

---

## Run locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

## Interaction walkthrough

1. Open the case and begin examination.
2. Review the four archive records and their evidence status.
3. Enter current-condition inspection and move the raking-light control toward a shallow grazing angle.
4. Once the upper-right shoulder feature is legible, capture the human-reviewed observation as `OBS-04`.
5. Review the honest A/B documentation comparison and its lighting-equivalence limitation.
6. Inspect the evidence lineage and qualified `FND-01` finding.
7. Generate the archival Evidence Record and export it locally as JSON.

## Professional limitations

- The visualization does not automatically detect or classify a crack.
- Absence from a photograph does not prove physical absence.
- Earlier diffuse-light documentation is not equivalent to the return raking-light examination.
- The highlighted review period is not a claim about when a feature physically occurred.
- No determination of cause or liability is made by this record.
- The output is not a legal or insurance determination.

## Fictional data

North Archive Museum, Alder House Museum, Meridian Fine Art Logistics, the object, and every record in this prototype are fictional demonstration data.
