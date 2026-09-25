# CONDITION TRACE — Evidence in Motion

## Contra portfolio metadata

**Title**  
CONDITION TRACE — Evidence in Motion

**Short description**  
An interactive conservation-evidence system for establishing the first documented appearance of a surface feature across non-equivalent museum condition records — without overstating cause, physical timing, or liability.

**Roles**
- Product Designer
- Interaction Designer
- Front-End Developer

**Tools**
- React
- TypeScript
- React Three Fiber / Three.js
- Framer Motion
- Anime.js
- Playwright
- Remotion

**Industries**
- Museums & Cultural Institutions
- Arts & Culture

**Collaborators**  
None.

**Organizations / companies**  
None. All institutions in the prototype are fictional.

**Project dates**  
August 2026 — September 2026

**Live prototype**  
https://day16-condition-trace.vercel.app

**Current repository cover**  
https://github.com/Faadil1/day16-condition-trace/raw/main/submission-video/screenshots/04-condition-trace-cover-4x5.png

> Keep the Contra project as a draft until the final cover/layout has been reviewed.

---

## The problem

Condition reports capture what was visible during an examination, but they cannot always establish when a physical change actually occurred.

In this fictional museum-loan case, the obvious question — **“Where did the damage happen?”** — asks more of the evidence than the records can support.

So I reframed the problem:

> **Do not trace where the damage occurred. Trace when the feature first appears in the documentation record.**

---

## The product

Condition Trace is an interactive conservation-evidence workflow that lets a reviewer inspect four condition records, examine the object under raking light, preserve a human-reviewed observation, compare non-equivalent documentation, and resolve the evidence into a qualified archival finding.

The workflow is:

```text
Open → Records → Inspect → OBS-04 → Compare → Finding → Record
```

---

## The key interaction

The return-arrival examination introduces **raking light**.

As the grazing angle changes, a hairline crack on the vessel’s upper-right shoulder becomes legible.

That examination state is preserved as **OBS-04** and remains visually continuous through the rest of the workflow.

This is not automatic detection. The observation remains human-reviewed.

---

## Evidence in Motion

V4 was designed around four interaction laws.

### Evidence has continuity

The captured observation persists through comparison, finding, and final record instead of resetting between screens.

### Light is the instrument

Raking light performs an examination job rather than acting as a visual effect.

### Evidence has resistance

The final finding requires a deliberate **hold-to-seal** interaction before it becomes an archival record.

### Archive closes the loop

The workflow resolves into a durable Evidence Record instead of a generic success state.

---

## The evidence chain

```text
SRC-03 → OBS-04 → CMP-01 → LIM-01 → FND-01
```

The system reaches one deliberately narrow conclusion:

> **First documented appearance — Aug 3, 2026.**

Earlier records were captured under different examination conditions, so prior physical absence cannot be confirmed.

---

## What the system refuses to claim

Condition Trace does not:

- automatically detect damage;
- assign a confidence score;
- determine physical cause;
- identify the exact moment of damage;
- determine where damage physically occurred;
- assign responsibility or liability.

The goal is not to make uncertainty disappear.

It is to make the **boundary of the evidence visible and traceable**.

> **Trace the record. Not the blame.**

---

## Interaction details

The product preserves the same evidence identity across the workflow:

1. the reviewer enters the return-arrival examination;
2. the raking-light angle is lowered toward the review range;
3. the feature becomes legible;
4. the examination frame is preserved as **OBS-04**;
5. Compare keeps the captured observation visible beside the earlier non-equivalent documentation;
6. the evidence lineage makes the limitation explicit;
7. **FND-01** states the first documented appearance;
8. the reviewer deliberately holds to seal the result;
9. the chain resolves into the final Evidence Record.

---

## Build

Condition Trace was built with React, TypeScript, React Three Fiber / Three.js, Framer Motion, Anime.js, Playwright, and Remotion tooling.

The implementation includes:

- interactive raking-light examination;
- evidence identity continuity;
- deterministic browser QA;
- responsive behavior;
- reduced-motion support;
- animated evidence lineage;
- hold-to-seal finalization;
- archival Evidence Record resolution.

---

## Context

Condition Trace is **Day 16** of *30 Days of Real Business Problems* and the first project released in **Phase II** after the challenge paused at Day 15.

The return principle is simple:

> **I changed how I build — and this is the first evidence.**
