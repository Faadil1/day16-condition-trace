# TRACE Design Workflow — System Architecture

TRACE is the reusable product/design workflow distilled from the Condition Trace V3 build. It is not a reference list and not a single mega-prompt. It is a gated decision system designed to preserve product truth, create domain-specific visual language, and compound learning across projects.

## TRACE mnemonic

### T — Truth
Protect the product contract before styling.
- Gate 0 — Proof / Product Contract
- critical user job
- critical promises and claims
- canonical data
- evaluator/customer proof path
- limitations that visual work may not hide or strengthen

### R — Research & References
Understand the task, then extract language from the domain.
- Gate 1 — Product / Flow
- Gate 1.5 — Domain Metaphor
- Gate 2 — Visual Direction

### A — Art Direction & Architecture
Choose one coherent language before multiplying UI.
- Gate 2.25 — Visual Prototype
- Gate 2.5 — Palette / Brand
- Gate 3 — Design System
- Gate 3.25 — Typography Lock

### C — Character & Construction
Make the product recognizable through job-specific interaction, not effects for their own sake.
- Gate 4 — Differentiation
- Gate 4.25 — Uniqueness Audit
- Gate 4.5 — Data Visualization when applicable
- Gate 4.75 — Visual Asset Production when applicable
- Gate 5 — Targeted Reference during implementation

### E — Evaluation & Evolution
Validate how the product is actually experienced, presented and learned from.
- Gate 6 — QA / Polish
- Gate 6.5 — Evaluation Capture
- Gate 6.75 — Demo Narrative / Evidence Film
- Gate 7 — Freeze / Promotion
- Gate 8 — Post-mortem / Learning Promotion

---

# Three-layer architecture

## 1. Workflow Kernel
The stable rules that apply across projects:
- gates and prerequisites
- required outputs
- proof-preservation rules
- anti-slop rules
- signature budget
- QA requirements
- learning-promotion policy

The Kernel should change slowly and only through post-mortem evidence.

## 2. Project Adapter
A compact project-specific contract. Example for Condition Trace:

```yaml
project: condition-trace
mode: hackathon

proof_contract:
  critical_job: establish the first documented appearance of a condition feature
  protected_claims:
    - first documented appearance is Aug 3 2026
    - prior absence cannot be confirmed
    - no cause or liability determination

product_flow:
  - open
  - records
  - inspect
  - compare
  - finding
  - record

domain_metaphors:
  - conservation examination
  - archive folio
  - evidence trace
  - qualified finding
  - institutional record

visual_direction:
  name: Smoky Patina Archive
  palette_anchor: "#24363A"

typography:
  display: Newsreader
  reading: Manrope
  technical: DM Mono

signature_budget:
  primary: raking-light examination
  narrative: evidence trace
  resolution: finding-to-record
  micro_interactions:
    - archive record selection
    - OBS-04 preservation seal

source_of_truth:
  branch: design/uiux-v3-smoky-patina
```

The Project Adapter may evolve quickly. Project-specific tricks should not automatically become Kernel rules.

## 3. Tool Adapters
Tools are selected by job and gate, not by novelty.

Example registry pattern:

```yaml
animejs:
  gate: differentiation
  jobs:
    - editorial choreography
    - SVG path animation
    - staged evidence sequences
  avoid_when:
    - simple layout transition
    - real 3D

motion:
  gate: differentiation
  jobs:
    - layout transitions
    - gestures
    - springs

threejs:
  gate: differentiation
  jobs:
    - real 3D
    - camera and lighting
    - spatial examination

mobbin:
  gate: product-flow
  jobs:
    - task flows
    - onboarding patterns
    - mobile product behavior

ai_color_picker:
  gate: palette-brand
  jobs:
    - palette exploration
    - contrast tuning
    - color-role validation
```

A tool can be a reference without becoming a runtime dependency.

---

# Gate 6.75 — Demo Narrative / Evidence Film

The demo is treated as a product artifact, not an afterthought.

## Purpose
Translate evaluator/user experience into a concise story without creating a stronger claim than the live product supports.

## Rules
1. **Proof-bearing moments must come from the real product.**
   - real raking-light interaction
   - real OBS-04 capture
   - real comparison state
   - real evidence lineage
   - real generated Evidence Record
2. Remotion, editing, camera moves and overlays may improve pacing and legibility, but must not fabricate a prior comparable image, automated detection, cause, timing or liability.
3. A cinematic recreation may be used for atmosphere, intro/outro or non-proof visual transitions only when it is clearly not the source of evidence.
4. The film should expose the product-specific interaction before generic UI chrome.
5. The final frame should communicate both outcome and limitation.

## Recommended narrative structure

`Problem → Records → Examine → Preserve → Compare → Qualify → Archive`

This maps directly to Condition Trace's product logic and makes the signature interactions understandable without a long explanation.

---

# Learning promotion policy

A new reference, library or technique is promoted into TRACE only if all four questions have a strong answer:

1. Did it solve a real product/design problem?
2. Is the lesson reusable across multiple projects?
3. Can it be assigned to a clear gate/job?
4. Does it add a capability rather than duplicate an existing one?

If not, keep it in the Project Adapter or project notes.

---

# Recommended implementation path for TRACE itself

## Now — repository-backed Kernel
Maintain Markdown/YAML source of truth in GitHub so the method is inspectable and versioned.

## Next — executable skill
Build a skill that can:
- detect the active gate
- inspect prerequisites
- select appropriate references/tools
- produce the gate's required output
- refuse premature polish when proof/flow is unresolved
- update a compact canonical project state
- run post-mortem and learning promotion

## Later — ChatGPT App / MCP layer
Only after the Kernel has been proven across multiple projects, expose actions such as:
- `audit_project`
- `detect_current_gate`
- `recommend_references`
- `generate_visual_directions`
- `run_uniqueness_audit`
- `run_typography_audit`
- `freeze_design_system`
- `create_project_adapter`
- `run_postmortem`
- `promote_learning_to_kernel`

The app should orchestrate the Kernel; it should not become the source of truth itself.
