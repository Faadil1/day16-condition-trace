# Canonical UI/UX Workflow — TRACE

TRACE is the compact human-readable frame for this workflow:
- **T — Truth**: proof/product contract
- **R — Research & References**: flow, domain metaphor, visual direction
- **A — Art Direction & Architecture**: visual prototype, palette, system, typography
- **C — Character & Construction**: differentiation, uniqueness, targeted implementation
- **E — Evaluation & Evolution**: QA, evaluation capture, demo narrative, freeze and post-mortem

This workflow is the default design process for hackathon/product builds. References are used to extract behavior, structure and quality bars — never to copy another product's identity.

The system has three layers:
1. **Workflow Kernel** — stable gates, decision rules, anti-slop constraints and required outputs.
2. **Project Adapter** — domain, audience, proof contract, constraints, design system and signature interactions for one project.
3. **Tool Adapters** — references/libraries/services invoked only when the active gate needs them.

## Gate 0 — Proof / Product Contract
Use before visual work whenever the product has claims, evidence, evaluator requirements or non-negotiable business logic.

Define:
- critical user job
- critical promises
- canonical data / claims
- evaluator or customer proof path
- limitations that must remain visible
- behaviors that visual work may not silently change

Output: frozen proof contract.

Rule: **Proof Preservation** — design may change presentation, hierarchy and interaction, but not the meaning of canonical evidence, data, claims or limitations without reopening Gate 0.

## Gate 1 — Product / Flow
Use when tasks, sequence or friction are still unresolved.
- Mobbin
- Pageflows
- Femke
- UXGoodies / Janus for AI-product patterns
- Fiona Lim when conversion is central

Output: task model, flow order, friction decisions.

## Gate 1.5 — Domain Metaphor
Before choosing visual fashion, identify the product-native language that can shape the interface.

Extract 2–4 domain-native nouns/actions that can drive:
- terminology
- layout
- materiality
- interaction
- motion
- visual hierarchy

Rule: uniqueness should emerge from the product's job before it comes from effects.

Output: domain metaphor set + vocabulary anchors.

## Gate 2 — Visual Direction
Use after the flow and domain metaphor are stable.
- Daniel Snows
- Awwwards
- Dribbble
- AppBrainy
- Collect UI

Rule: select one dominant direction. Do not mix several visual identities.

## Gate 2.25 — Visual Prototype
Before implementing a major redesign, create 2–3 coherent visual directions and compare full-screen screens, not isolated components.

Each direction must define:
- composition
- hierarchy
- materiality
- typography tone
- motion intent
- screen-to-screen continuity

Rule: do not code several competing aesthetics. Validate visually, then implement one.

## Gate 2.5 — Palette / Brand Validation
Use before design-system lock.
- AI Color Picker — concrete palette selection, tuning and contrast exploration

Output: primary environment color, neutral system, action/accent colors and state colors.

## Gate 3 — System
Use before multiplying screens.
- Zander Whitehurst
- Figma
- Apple HIG
- Material
- IBM Carbon
- component.gallery

Lock typography roles, color tokens, spacing, radius, components, states and responsive rules.

## Gate 3.25 — Typography Lock
Typography is treated as a system, not final polish.

Define:
- display/editorial family
- reading/UI family
- technical/mono family
- weights that are actually loaded
- minimum readable sizes
- desktop/tablet/mobile scales
- line heights and measure

Rule: micro-type may be used for non-essential IDs; useful content must remain comfortably readable.

## Gate 4 — Differentiation
Use only after the product works.

### Behavior references
- Rina Grim
- 60fps.design
- Sohrab Khan
- React Bits
- Magic UI
- Canvas UI
- KokonutUI

### Execution tools
- Anime.js — DOM/SVG choreography, editorial sequences, evidence-path animation and staged timelines
- Motion / Framer Motion — React layout transitions, gestures, springs and physics-like interaction
- GSAP — complex timelines, scroll-linked animation and advanced sequencing
- Rive — interactive vector state machines
- Three.js / React Three Fiber — spatial interaction, lighting, cameras and true 3D

Rule: `Reference ≠ Copy`. Extract the useful behavior and rebuild it in the product's visual language.

Default differentiation budget: **1 primary signature effect + 1 secondary narrative signature + up to 2 strong micro-interactions**. Add more only when each effect performs a distinct product job.

### Motion Job Matrix
Assign one owner per motion class whenever possible:
- spatial / real 3D → Three.js
- editorial / sequence / SVG → Anime.js
- layout / gesture / spring → Motion
- advanced time/scroll orchestration → GSAP
- interactive vector state machine → Rive

Do not add a motion library without a distinct job.

## Gate 4.25 — Uniqueness Audit
Before adding more effects, test whether the current product already has a recognizable language.

Ask:
- Could this screen belong to a generic AI SaaS?
- Are the strongest interactions inseparable from the product's job?
- Is the domain metaphor visible without reading the pitch?
- Does each signature clarify a state, sequence, causality, evidence or hierarchy?
- Are we translating a reference principle, or copying its surface treatment?

If generic, rework composition/metaphor before adding effects.

## Gate 4.5 — Data Visualization, when applicable
- Bklit for web-native designed chart patterns
- Deneb / Vega for declarative BI visualization
- D3 for custom data-driven interaction

Data-viz is selected by analytical job, not visual novelty.

## Gate 4.75 — Visual Asset Production, when applicable
- Limora for on-brand generated asset systems
- Image generation tools for bespoke campaign/product imagery

Only after brand direction is locked.

## Gate 5 — Targeted Reference
During build, consult a reference only for a specific unresolved component, state or interaction. Avoid reopening the whole art direction.

## Gate 6 — QA / Polish
Validate:
- responsive behavior
- keyboard/touch interaction
- reduced motion
- accessibility/contrast
- loading/error/empty states
- typography in the rendered interface
- print/export where relevant
- performance
- reference-vs-build quality gap

## Gate 6.5 — Evaluation Capture
Validate the exact contexts in which the work will be judged or consumed:
- evaluator/user viewport
- mobile
- screenshots/demo video
- print/PDF/export where applicable

Rule: a product can be correct in-browser and still fail in the way it is actually presented.

## Gate 6.75 — Demo Narrative / Evidence Film
Treat the showcase video as a product artifact rather than an afterthought.

Define:
- the narrative arc the evaluator should understand
- which moments are proof-bearing and therefore must come from the real product
- which moments may be cinematically framed or recreated for atmosphere only
- video typography/readability
- final limitation/outcome frame

Default narrative structure:

`Problem → Product-specific interaction → Evidence/state change → Qualified outcome → Final artifact`

Rules:
1. Real product footage is the source of truth for proof-bearing behavior.
2. Editing/Remotion may crop, annotate, sequence and improve pacing but may not fabricate stronger evidence or capabilities.
3. Cinematic recreations are acceptable only for non-proof atmosphere/transition shots.
4. The primary signature interaction should appear early enough to make the product memorable.
5. The final frame should preserve important limitations, not only the success state.

Output: shot list + capture contract + approved master format.

## Gate 7 — Freeze / Promotion
Treat branching as a design safety mechanism.

- preserve a known-good baseline
- freeze proven layers
- explore uncertain layers on a dedicated branch
- promote only after functional, visual and responsive checks

Output: final design contract + promoted source of truth.

## Gate 8 — Post-mortem / Learning Promotion
After a meaningful milestone or project completion:
- record what improved quality
- record what caused unnecessary iteration
- separate project-specific tricks from generalizable rules
- promote only generalizable rules into the Workflow Kernel

This is how the workflow compounds instead of becoming a static checklist.

---

# Condition Trace application of the workflow

Condition Trace must remain a conservation/evidence product, not a generic futuristic dashboard.

## Proof contract
The canonical vessel, raking-light examination, captured observation, comparison limitation, evidence lineage and qualified finding are proof-bearing product behavior. Visual work cannot silently strengthen claims or hide non-equivalent evidence conditions.

## Domain metaphors
- conservation examination
- archive folio
- evidence trace
- qualified finding
- institutional record

These metaphors drive the UI more strongly than generic dashboard/component patterns.

## Signature hierarchy

### Primary signature — Raking-light examination
Three.js / R3F owns the object, grazing-light behavior and spatial examination. The canonical vessel and evidence behavior remain proof-driven.

### Secondary signature — Evidence Trace
Anime.js + SVG turns:

`SRC-03 → OBS-04 → CMP-01 → LIM-01 → FND-01`

into a visible bronze evidence path. The motion communicates derivation, not decoration.

### Resolution signature — Finding to Record
`FND-01` visually resolves into the institutional Evidence Record. The transition communicates that a qualified finding becomes an archived, exportable record.

### Supporting micro-interactions
- selected archive folio receives a moving bronze selection mark
- OBS-04 capture receives a short preservation seal before Compare

### Supporting materiality
Use restrained archive grain, parchment fibre and smoky/patina surfaces. No neon, gratuitous glassmorphism, holographic chrome or generic AI gradients.

## Typography contract
- Newsreader — editorial/display voice
- Manrope — reading/UI voice
- DM Mono — IDs, dates, states and technical notation

Useful content must not depend on 5–8px text. Micro-identifiers may be smaller only when non-essential.

## Demo narrative contract
For the final showcase film:
- capture all proof-bearing interactions from the real V3 app;
- use Remotion for pacing, crops, annotations and cinematic continuity;
- do not create a fake prior raking-light image;
- keep the limitation `Prior physical absence cannot be confirmed` narratively visible;
- preserve the sequence `records → examine → preserve → compare → qualify → archive`.

See `docs/VIDEO_DEMO_GUIDE.md` for the complete shot plan.

## Tool policy for Condition Trace
- Anime.js: yes — evidence choreography and Finding → Record bridge
- Three.js: yes — raking-light signature
- Framer Motion / Motion: yes — simple React transitions, layout and record-selection movement
- React Bits / Magic UI: references only unless a component solves a real product job; rebuild behavior in Condition Trace language
- Rive: no current need; avoid a second competing interaction system
- KokonutUI Liquid Glass: not aligned with Smoky Patina Archive
- Bklit: not relevant to this evidence workflow
- Limora: optional later for submission/OG/promo assets, not core UI

## Anti-slop rules
1. No effect is added because it is trendy.
2. Every animation must clarify state, sequence, causality, evidence or hierarchy.
3. Bronze is evidence/action signal, not decoration.
4. Parchment is reserved for documentary artifacts.
5. Motion remains short and purposeful; reduced-motion always has a complete static state.
6. The raking-light interaction remains the strongest wow moment.
7. When uniqueness is weak, fix metaphor/composition before adding another library.
8. Video polish may improve presentation but cannot strengthen the product's claims beyond the live experience.
