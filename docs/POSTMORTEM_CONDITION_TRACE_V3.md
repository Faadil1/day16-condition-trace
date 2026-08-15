# Condition Trace V3 — Design Post-mortem

## Executive outcome
Condition Trace became materially stronger when the design process stopped treating UI polish as a styling pass and started treating it as a sequence of gated product decisions. The strongest improvements came from preserving proof logic first, choosing one visual metaphor, assigning each tool a job, and making motion communicate evidence rather than decorate the interface.

The generalizable system is now framed as **TRACE**:

- **T — Truth**
- **R — Research & References**
- **A — Art Direction & Architecture**
- **C — Character & Construction**
- **E — Evaluation & Evolution**

## What worked

### 1. Functional/proof baseline before art direction
The canonical vessel, raking-light examination, capture pipeline, comparison limitation, evidence lineage and record export were stabilized before the V3 visual redesign. This prevented visual experimentation from rewriting the product's claims.

Reusable rule: **Proof Preservation Gate** — a design pass may change presentation, hierarchy and interaction, but may not silently change canonical data, evidence meaning, limitations, claims or evaluator experience.

### 2. Branching as a design safety mechanism
Keeping a known-good baseline while exploring V2/V3 made experimentation reversible.

Reusable rule: **Branch & Freeze Gate** — freeze proven layers and explore uncertain layers on a dedicated branch. Promote only after visual, functional and responsive checks.

### 3. Visual concepts before implementation
The strongest visual decision came after comparing complete visual directions, then selecting Neo-Museum Archive and evolving it into Smoky Patina Archive.

Reusable rule: **Visual Prototype Gate** — before a major redesign, create 2–3 coherent directions and validate them visually before implementation. Do not code several competing aesthetics.

### 4. Palette as its own decision
Using AI Color Picker after direction selection but before final system lock improved coherence and prevented arbitrary accent drift.

Reusable rule: palette is a dedicated gate, not a CSS cleanup task.

### 5. Product-specific metaphors created uniqueness
The product became distinctive when the interface language came from conservation work itself:
- raking-light examination
- documentary folios
- evidence trace
- qualified finding
- institutional record

Reusable rule: **Domain Metaphor Gate** — identify 2–4 domain-native nouns/actions that can shape layout, motion, materiality and terminology. A unique interface should emerge from the product's job, not from a trendy component library.

### 6. Motion improved when every effect had a narrative job
Anime.js was useful because evidence lineage, capture and Finding → Record are sequences. Three.js remained responsible for spatial examination. Motion/Framer Motion remained responsible for layout/state transitions.

Reusable rule: **Motion Job Matrix** — assign one owner per motion class:
- spatial/3D → Three.js
- editorial/sequence/SVG → Anime.js
- layout/gesture/spring → Motion
- complex scroll/time orchestration → GSAP
- interactive vector state machine → Rive

Do not add a library without a distinct motion job.

### 7. Signature budget prevented AI-slop accumulation
The strongest hierarchy is:
1. Raking-light examination — primary wow moment
2. Evidence Trace — narrative signature
3. Finding → Record — resolution signature
4. Record selection + OBS-04 capture — supporting micro-interactions

Reusable rule: **1 primary signature + 1 narrative signature + up to 2 strong micro-interactions** by default.

### 8. Typography required its own late-stage audit
The font families were appropriate, but many labels and evidence details were 5–9px because the layout had been optimized for density rather than reading. The visual system improved after establishing minimum readable sizes and role-specific type scales.

Reusable rule: **Typography Lock + Typography QA** are separate moments. Lock families/roles early; audit actual rendered sizes after layout stabilizes.

### 9. The showcase video is part of product truth
A polished video can accidentally create stronger claims than the live product if proof-bearing moments are recreated cinematically instead of captured from the source experience.

For Condition Trace, the correct approach is hybrid:
- real V3 application footage for raking light, OBS-04 capture, Compare, Evidence Trace and Evidence Record;
- Remotion for pacing, crops, annotations, sequencing and final storytelling;
- cinematic Three.js recreation only for non-proof atmosphere when needed.

Reusable rule: **Demo Narrative / Evidence Film Gate** — define what must come from the live product before editing. Presentation may clarify evidence but may not invent it.

## What did not work / created unnecessary iteration

### 1. Styling before composition
Early redesign passes risked becoming recolors of the same dashboard composition.

Correction: every major visual direction must define screen composition, information hierarchy and interaction model — not only palette, shadows and surfaces.

### 2. Too many tiny labels
Small mono labels looked sophisticated in still mockups but were weak in real use and on mobile.

Correction: no useful content should rely on micro-type. Micro identifiers can be small; readable information cannot.

### 3. Tool-first novelty
Libraries such as Liquid Glass, shader backgrounds, animated beams or Rive could have been added simply because they were available.

Correction: use tools as reference libraries first. Import only when the product job clearly benefits.

### 4. Visual uniqueness can be confused with visual complexity
More effects would have made Condition Trace less distinctive by moving it toward generic futuristic UI.

Correction: uniqueness is produced by a coherent metaphor, not by effect count.

### 5. A video can become a second product implementation
Rebuilding the evidence workflow inside a cinematic renderer would duplicate logic and risk visual/proof drift.

Correction: capture canonical product behavior and let the video layer edit it. Recreate only atmosphere, never proof.

## New canonical gates derived from this project

### Gate 0 — Proof / Product Contract
Before visual work, define:
- critical user job
- critical promises
- canonical data/claims
- evaluator path
- non-negotiable limitations

Output: frozen proof contract.

### Gate 1 — Product / Flow
Define tasks, order and friction.

### Gate 1.5 — Domain Metaphor
Extract domain-native visual/interaction language.

Output: 2–4 metaphors and vocabulary anchors.

### Gate 2 — Visual Direction
Compare coherent directions.

### Gate 2.25 — Visual Prototype
Generate full-screen visual concepts before implementation.

### Gate 2.5 — Palette / Brand
Validate palette and state colors.

### Gate 3 — System
Lock typography roles, colors, spacing, components and responsive behavior.

### Gate 3.25 — Typography Lock
Define:
- display family
- reading family
- technical/mono family
- weights actually loaded
- minimum readable sizes
- desktop/mobile type scales

### Gate 4 — Differentiation
Choose domain-specific signatures and motion jobs.

### Gate 4.25 — Uniqueness Audit
Ask:
- Could this screen belong to a generic AI SaaS?
- Are the strongest interactions inseparable from the product's job?
- Is the visual metaphor visible without reading a pitch?
- Are we copying a reference or translating its principle?

If generic, rework before adding effects.

### Gate 5 — Targeted Reference
Consult a reference only for a specific unresolved problem.

### Gate 6 — QA / Polish
Responsive, accessibility, motion, print/export, performance and typography QA.

### Gate 6.5 — Evaluation Capture
Validate the exact contexts in which the work will be judged or used:
- evaluator viewport
- mobile
- screenshots/video
- print/PDF/export where applicable

### Gate 6.75 — Demo Narrative / Evidence Film
Define:
- narrative arc
- proof-bearing shots
- source-of-truth capture requirements
- cinematic/non-proof shots
- video typography
- master format

Rule: video polish cannot strengthen claims beyond the live product.

### Gate 7 — Freeze / Promotion
Freeze proven layers, promote the selected branch and record the final design contract.

### Gate 8 — Post-mortem / Learning Promotion
After completion, promote only generalizable lessons into the canonical workflow. Project-specific tricks remain project adapters.

## The reusable architecture
The workflow should not be one giant prompt. It has three layers:

1. **Workflow Kernel** — stable gates, decision rules, anti-slop constraints, required outputs.
2. **Project Adapter** — domain, audience, constraints, proof contract, design system and signature interactions for one project.
3. **Tool Adapters** — Mobbin, AI Color Picker, Figma, Anime.js, Motion, Three.js, Bklit, etc.; each tool is invoked only when its gate/job requires it.

This structure allows the system to evolve without forcing every project to use every reference or library.

## Implementation recommendation for TRACE itself
Do not begin with a monolithic plugin/app.

Recommended sequence:
1. keep the Workflow Kernel versioned in GitHub;
2. create an executable skill that detects gates, prerequisites and outputs;
3. maintain project adapters and tool adapters as machine-readable state;
4. after the Kernel has been tested across multiple projects, expose it through a ChatGPT App/MCP layer.

The app should orchestrate the workflow, not replace its source of truth.
