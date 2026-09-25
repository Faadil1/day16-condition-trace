# Condition Trace — Evidence in Motion V4

## Status

**Promoted to `main`.**

V4 is the current product/design direction for Condition Trace.

The product truth remains unchanged from the verified evidence contract:

```text
first documented appearance ≠ physical moment of damage
```

The design goal of V4 is to make that truth legible through interaction rather than decoration.

---

## Design thesis

**Evidence should not reset when the screen changes.**

A captured observation should feel like the same piece of evidence moving through examination, comparison, qualification, and archival closure.

This creates the V4 interaction model:

```text
LIGHT → OBSERVE → PRESERVE → COMPARE → LIMIT → FIND → SEAL → RECORD
```

---

## Four laws

### 1. Evidence has continuity

OBS-04 is not a transient success message.

Once captured, its identity persists through:

- Compare
- Finding
- evidence lineage
- final Record

The same observation is carried through the workflow rather than reintroduced as disconnected UI.

### 2. Light is the instrument

The strongest product mechanism is the raking-light examination.

The user changes light angle until the upper-right shoulder hairline becomes legible.

The interface must make the distinction between:

- **feature not visible under earlier documentation conditions**
- **feature legible under the current raking-light examination**

without converting that difference into a claim of prior physical absence.

### 3. Evidence has resistance

Finalization uses a deliberate hold-to-seal interaction.

The intent is not gamification. The resistance marks a change of state:

```text
reviewable finding → deliberate archival record
```

### 4. Archive closes the loop

The final state is an Evidence Record, not a generic confirmation screen.

The finding resolves into a durable record containing the documented observation, limitation, provenance, and evidence lineage.

---

## Canonical evidence chain

```text
SRC-03 → OBS-04 → CMP-01 → LIM-01 → FND-01
```

Meaning:

- **SRC-03** — prior source record
- **OBS-04** — captured return-arrival observation
- **CMP-01** — documentation comparison
- **LIM-01** — non-equivalence / documentation limitation
- **FND-01** — qualified finding

Canonical finding:

> **First documented appearance — Aug 3, 2026.**

Required limitation:

> Earlier diffuse-light records are not equivalent to the Aug 3 raking-light examination. Prior physical absence cannot be confirmed.

---

## V4 implementation surface

V4 modified the following product areas:

- `AppShell` — continuity and current-state orchestration
- `ObjectStage` — examination and visual anchor
- `ComparisonView` — captured observation continuity
- `EvidenceLineage` — evidence chain motion
- `GeneratedRecord` — final archival resolution
- `HoldToSealButton` — deliberate finalization interaction
- `useEditorialMotion` — choreography
- `evidence-in-motion-v4.css` — V4 visual layer

The current code also includes deterministic browser QA support for the major visual states.

---

## Verified interaction path

```text
Open
→ Records
→ Inspect
→ progressive raking light
→ OBS-04 capture
→ Compare
→ Finding
→ Hold to Seal
→ Record
```

The V4 QA path verifies:

- the raking-light review range;
- the feature reveal;
- OBS-04 continuity;
- AREA MATCH;
- LIGHTING GAP;
- evidence lineage;
- hold-to-seal resistance;
- final record language;
- documentation-gap language.

---

## Anti-slop constraints

Do not reintroduce:

- generic dark SaaS styling;
- neon / holographic forensic aesthetics;
- gratuitous glassmorphism;
- decorative motion without an evidence job;
- synthetic AI-detection language;
- confidence scores;
- blame or liability framing.

The interface can feel cinematic, but every major visual or motion decision must still serve examination, evidence continuity, qualification, or archival closure.

---

## Visual references

V4 took inspiration from interaction mechanics rather than layout copying:

- physical resistance before commitment;
- object continuity across spatial transitions;
- archival/folder materiality;
- disciplined procedural sound;
- security-triage clarity;
- compact evidence micrographics.

The result should remain domain-native to conservation and archival review.

---

## Release position

Condition Trace V4 is the first product proof in Phase II of **30 Days of Real Business Problems**.

The release narrative is:

```text
velocity → rupture → silence → decision → return
```

Condition Trace is the first evidence of the changed build standard.
