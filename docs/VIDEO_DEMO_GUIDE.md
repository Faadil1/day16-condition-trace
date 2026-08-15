# Condition Trace — Demo Film Guide

This guide is for the Day 16 agent working on the final showcase video. The goal is to make Condition Trace feel like a specialized, credible product while preserving the exact evidence logic of the live build.

## Recommendation

Create one **master 16:9 film, 38–45 seconds, 1920×1080 at 30fps**.

Primary route:
1. capture proof-bearing interactions from the real V3 application;
2. use Remotion to sequence, crop, annotate and pace those real captures;
3. use Three.js only for the real raking-light interaction or for clearly atmospheric/non-proof shots.

Do not rebuild proof-bearing screens as fake cinematic replicas if a real application capture exists.

---

# Narrative promise

**TRACE THE RECORD. NOT THE BLAME.**

The film should make this logic visible:

`records → examine → preserve → compare → qualify → archive`

The viewer should understand that Condition Trace establishes the **first documented appearance** of a condition feature, while preserving the limitation that earlier physical absence cannot be confirmed.

---

# Route A — Live screen film

Use this when speed and product authenticity matter most.

## Capture setup
- Desktop viewport: 1440×900 or 1600×1000.
- Browser zoom: 100%.
- Use the V3 branch/build, not an older production layout.
- Hide browser clutter when possible.
- Record pointer movement deliberately and slowly.
- Do not rush the Anime.js evidence animations.
- Capture a clean run from reset before each take.

## Shot plan

### 00:00–00:04 — Identity / case opening
Show the V3 Open screen.

Hold long enough to read:
- CONDITION TRACE
- `TRACE THE RECORD. NOT THE BLAME.`
- the object and case brief

Optional title overlay in edit:
`When a condition feature appears, the records rarely agree on how it was examined.`

### 00:04–00:09 — Evidence archive
Enter Records.

Show:
- four archive folios;
- bronze moving selection mark;
- prior records marked PARTIAL;
- Aug 3 raking-light record as VERIFIED.

Do not imply the earlier diffuse-light records prove absence.

### 00:09–00:17 — Signature 01: raking-light examination
Enter Inspect.

This is the longest uninterrupted interaction in the film.

Show:
- the real Three.js vessel;
- grazing-angle control moving toward ~8–9° from surface;
- the upper-right shoulder feature becoming legible;
- `capture ready` state.

The point is not a flashy 3D spin. The point is that **examination conditions change what documentation can reveal**.

### 00:17–00:20 — Preserve OBS-04
Trigger Capture Observation.

Hold for the short preservation seal:
- `OBS-04`
- `FRAME PRESERVED`
- grazing angle
- upper-right shoulder
- human-reviewed

This moment should feel like evidence entering custody, not like taking a screenshot.

### 00:20–00:27 — Compare honestly
Show Compare A/B.

Make sure the viewer can distinguish:
- A — no equivalent prior raking-light capture;
- B — actual captured OBS-04;
- `AREA MATCH / LIGHTING GAP`;
- limitation note.

Never insert a fake prior raking-light image.

### 00:27–00:34 — Signature 02: Evidence Trace
Enter Finding and let the bronze trace animate:

`SRC-03 → OBS-04 → CMP-01 → LIM-01 → FND-01`

Hold on:
`First documented appearance · Aug 3, 2026`

Then reveal the limitation:
`Prior physical absence cannot be confirmed.`

### 00:34–00:40 — Resolution: Finding → Record
Click Generate Evidence Record.

Let the bridge play:
`FND-01 → TRACE RESOLVED → Evidence Record`

Show the final document with:
- OBS-04 thumbnail;
- evidence lineage;
- qualified finding;
- limitation;
- export action.

### 00:40–00:44 — End card
Recommended copy:

**CONDITION TRACE**
`TRACE THE RECORD. NOT THE BLAME.`

Small line:
`Human-reviewed conservation evidence · first documented appearance, not cause or liability.`

---

# Route B — Remotion-directed film

Use this when the user wants a more controlled, cinematic showcase while retaining real product evidence.

## Architecture

Recommended folder strategy: keep the video isolated from the production bundle.

```text
/video
  /public
    open.mp4
    records.mp4
    inspect-raking.mp4
    capture.mp4
    compare.mp4
    finding.mp4
    record.mp4
  /src
    Root.tsx
    ConditionTraceFilm.tsx
    scenes/
      Intro.tsx
      Archive.tsx
      Examination.tsx
      Compare.tsx
      Finding.tsx
      Record.tsx
      EndCard.tsx
```

If a Remotion project does not already exist, scaffold it separately rather than adding Remotion runtime code to the product app.

Suggested command:

```bash
npx create-video@latest --yes --blank --no-tailwind video
cd video
npm i
```

To preview from an agent/Codex environment:

```bash
npx remotion studio --no-open
```

Only render when explicitly requested:

```bash
npx remotion render
```

## Remotion implementation rules

For deterministic renders:
- drive animation with `useCurrentFrame()` and `interpolate()`;
- do not rely on CSS `transition` or CSS keyframe animation for rendered motion;
- use `<Video>` from `@remotion/media` for actual product recordings;
- put captured assets in `public/` and address them with `staticFile()`;
- use sequences for scene timing;
- keep titles large enough for video, not web-UI microtype.

## Recommended composition

```text
0–4s    Intro / object identity
4–9s    Archive records
9–17s   Raking-light examination
17–20s  OBS-04 preservation
20–27s  Comparison
27–34s  Evidence Trace / finding
34–40s  Finding → Evidence Record
40–44s  End card
```

## Motion language

Use Condition Trace's existing visual grammar:
- smoky blue / patina field;
- parchment for documentary artifacts;
- bronze only for evidence/action;
- Newsreader for editorial statements;
- Manrope for readable explanation;
- DM Mono for IDs and technical notation.

Avoid:
- generic neon glows;
- fake holograms;
- excessive 3D camera spins;
- random kinetic typography;
- startup-style gradient blobs;
- animated beams unrelated to evidence.

### Film-specific signature
A thin bronze trace can move from one captured scene to the next, functioning as a visual continuity device. It should behave like provenance/evidence lineage, not like a decorative progress bar.

---

# Three.js policy for the film

## What may be live/reused
The canonical R3F/Three.js examination is the product's primary signature and should be captured from the real app whenever possible.

## When a separate Three.js film shot is acceptable
A dedicated cinematic object shot is acceptable for:
- intro atmosphere;
- end card background;
- non-proof transition.

If used, it must not:
- show a different crack state;
- create a prior raking-light observation that does not exist;
- imply automatic feature detection;
- change the canonical geometry/material in a way that undermines continuity with the app.

## Best practice
For proof-heavy moments, **record the canonical app**. Let Remotion edit the footage instead of trying to reproduce the same evidence logic in a second 3D implementation.

---

# Optional voiceover / captions

The film works without voiceover if the screen copy is readable. If narration is desired, keep it concise:

> A condition feature appears after a museum loan. Earlier records show the same area — but not under equivalent light. Condition Trace preserves the current observation, compares the documentation honestly, and establishes the first documented appearance without assigning cause or blame.

Do not narrate more certainty than the product supports.

---

# Audio direction

Optional, subtle only:
- quiet archival room tone;
- soft tactile clicks for record selection;
- restrained low-frequency movement during raking-light examination;
- one short paper/seal sound for OBS-04;
- a light tonal resolution when FND-01 becomes the Evidence Record.

Avoid trailer booms and aggressive sci-fi UI sounds.

---

# Capture acceptance checklist

Before approving the film, verify:
- [ ] The V3 Smoky Patina visual system is shown.
- [ ] The real raking-light interaction is visible.
- [ ] The crack is legible at the intended grazing angle without being exaggerated.
- [ ] OBS-04 is visibly preserved.
- [ ] Compare does not fabricate equivalent earlier evidence.
- [ ] `Prior physical absence cannot be confirmed` remains visible or narratively clear.
- [ ] `SRC-03 → OBS-04 → CMP-01 → LIM-01 → FND-01` is shown.
- [ ] Finding → Record transformation is shown.
- [ ] No cause/liability claim is introduced.
- [ ] Text remains readable at normal playback size.
- [ ] Total length remains tight enough for a hackathon/social showcase.

---

# Recommended decision

For the final Day 16 showcase, use a **hybrid**:

**real V3 screen capture for all proof-bearing interactions + Remotion for pacing, typography, cropping, transitions and end card.**

This gives the film cinematic control without separating the submission video from the actual product that evaluators can open.
