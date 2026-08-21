# Condition Trace V3 — Change Log

This file summarizes the meaningful changes already implemented on `design/uiux-v3-smoky-patina`. It is intended for agent continuity; the Git history remains the source for exact diffs.

## Baseline preserved before V3
The V3 branch was created only after the product/proof baseline had become stable.

Preserved behavior includes:
- Canonical Vessel V2.
- real raking-light examination via Three.js / R3F.
- grazing-angle framing measured from the surface.
- OBS-04 capture from the actual examination canvas.
- honest Compare A/B with no fake earlier equivalent image.
- evidence limitation that prior physical absence cannot be confirmed.
- qualified finding and evidence lineage.
- generated Evidence Record and JSON export.
- responsive/mobile baseline and reduced-motion behavior.

## V3 visual direction — Smoky Patina Archive

Replaced the older dark rose/museum-demo look with a more specific contemporary conservation/archive language.

Core palette:
- smoky anchor `#24363A`
- patina `#3F5B53`
- parchment `#F0E4CF`
- charcoal `#1D2324`
- bronze `#B78455`
- stone blue `#708B94`

Principles:
- archive materiality instead of generic glass UI;
- parchment reserved for documentary artifacts;
- bronze reserved for evidence/action;
- smoky/patina surfaces for environment/instrumentation;
- no neon/holographic/AI-gradient styling.

## Screen composition changes

### 01 Open
- converted into a real editorial case hero;
- large Condition Trace identity in the scene;
- object moved into a more deliberate hero composition;
- Case Brief panel treated as a compact archival card.

### 02 Records
- removed the unnecessary repeated hero-vessel composition;
- replaced it with an Evidence Archive surface;
- four interactive parchment folios;
- stronger chronology/evidence-status hierarchy;
- selected record shown as a documentary artifact.

### 03 Inspect
- preserved the canonical 3D vessel interaction;
- reframed the screen as a conservation instrument;
- raking-light dock and examination readouts made more deliberate;
- object remains the dominant visual focus.

### 04 Compare
- preserved actual OBS-04 capture as B;
- A remains an explicit documentary gap, not a fabricated prior comparable image;
- clearer `AREA MATCH / LIGHTING GAP` relationship;
- limitation and qualified comparison given stronger visual hierarchy.

### 05 Finding
- evidence lineage became a primary reasoning surface;
- `SRC-03 → OBS-04 → CMP-01 → LIM-01 → FND-01` remains explicit;
- qualified finding remains visually distinct from evidence and limitation.

### 06 Record
- Evidence Record is presented as a centered archival/document artifact;
- real OBS-04 capture and evidence lineage remain embedded;
- final finding and limitation remain visible/exportable.

## Motion / interaction changes

### Anime.js integration
Anime.js was added for editorial/sequential choreography, while responsibility remains separated:
- Three.js — real 3D, light, camera, spatial examination;
- Anime.js — editorial sequence, SVG/evidence choreography;
- Motion / Framer Motion — React/layout transitions and physical UI movement.

### Signature 01 — Raking-light examination
Remains the primary wow moment and product-native interaction.

### Signature 02 — Evidence Trace
An SVG bronze path now visually resolves the evidence lineage:

`SRC-03 → OBS-04 → CMP-01 → LIM-01 → FND-01`

The animation communicates derivation rather than decoration.

### Resolution signature — Finding → Record
Generating the Evidence Record now includes an intermediate resolution state:

`FND-01 → TRACE RESOLVED → Evidence Record`

This communicates that the qualified finding becomes an institutional artifact.

### Micro-interaction — archive selection
The selected Records folio receives a moving bronze selection mark rather than only a static color change.

### Micro-interaction — OBS-04 preservation seal
After Capture Observation, the app briefly shows:
- OBS-04
- FRAME PRESERVED
- grazing angle
- upper-right shoulder
- human-reviewed status

The seal appears after the real frame has been captured and is not baked into the evidence image.

## Materiality changes
- restrained archive grain on smoky/patina work surfaces;
- subtle parchment fibre on documentary artifacts;
- no gratuitous glassmorphism or glow system.

## Typography pass
The font families were retained because they fit the product:
- Newsreader — editorial/display;
- Manrope — reading/UI;
- DM Mono — evidence IDs and technical notation.

The type scale was rebuilt because many earlier elements had fallen to 5–9px.

V3 rules now include:
- useful content does not depend on 5–8px microtype;
- body/readable information generally sits around 11.5–14px depending on context;
- card titles sit around 18–22px;
- screen titles sit around 40–52px desktop;
- hero typography is larger;
- mobile keeps readable body sizes instead of uniformly shrinking the UI;
- requested font weights are aligned with weights actually loaded.

## Workflow/design-system changes
Condition Trace became the proving ground for the reusable **TRACE Design Workflow**.

New reusable concepts promoted from the project:
- Proof / Product Contract
- Domain Metaphor Gate
- Visual Prototype Gate
- Palette / Brand Gate
- Typography Lock and late Typography QA
- Motion Job Matrix
- Uniqueness Audit
- Evaluation Capture
- Demo Narrative / Evidence Film
- Freeze / Promotion
- Post-mortem / Learning Promotion

Architecture:
- Workflow Kernel
- Project Adapter
- Tool Adapters

See:
- `docs/UIUX_WORKFLOW_CANONICAL.md`
- `docs/TRACE_WORKFLOW_SYSTEM.md`
- `docs/POSTMORTEM_CONDITION_TRACE_V3.md`

## Video/demo preparation
A final demo-film contract has been added.

Recommended approach:
- capture the real V3 app for proof-bearing moments;
- use Remotion for sequence, typography, crops and transitions;
- use standalone Three.js only for non-proof atmosphere if needed;
- never fabricate a prior raking-light observation or stronger claim than the live product.

See `docs/VIDEO_DEMO_GUIDE.md` and `docs/DAY16_AGENT_HANDOFF.md`.

## Current continuation rule
Before adding another library, effect or redesign:
1. identify a real unresolved product/design job;
2. determine its TRACE gate;
3. check whether an existing tool already owns that job;
4. preserve the proof contract;
5. only then implement.
