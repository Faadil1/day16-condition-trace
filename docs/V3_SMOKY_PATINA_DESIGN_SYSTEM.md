# Condition Trace V3 — Smoky Patina Archive

## Design intent
Condition Trace V3 should feel like a contemporary conservation archive: institutional, material, editorial and precise. It should not resemble a generic SaaS dashboard, generic AI glass UI, or science-fiction control room.

The proof model is unchanged. V3 changes hierarchy, surface treatment, typography, spacing, information density and stage-specific composition.

## Palette

| Token | Hex | Role |
|---|---:|---|
| Smoky Blue 950 | `#111D20` | deepest application background |
| Smoky Blue 900 | `#17272A` | stage / dark work surface |
| Smoky Blue 800 | `#24363A` | primary V3 color, validated with AI Color Picker |
| Patina 800 | `#314B45` | institutional depth / secondary surface |
| Patina 700 | `#3F5B53` | panels, selected states, conservation tone |
| Patina 600 | `#587268` | secondary accents |
| Parchment | `#F0E4CF` | document / archival reading surface |
| Parchment 2 | `#E2D4BC` | nested document surface |
| Charcoal | `#1D2324` | text on parchment |
| Bronze | `#B78455` | primary action / active evidence / lineage signal |
| Bronze Soft | `#D0A779` | labels and high-value metadata |
| Stone Blue | `#708B94` | technical / examination accent |
| Dust Rose | `#A87570` | rare tertiary accent only |
| Sage | `#8EA095` | verified / calm status support |

## Color usage rules
1. Smoky Blue + Patina are the application environment.
2. Parchment is reserved for records and generated documentation; it should not fill the whole application.
3. Bronze is a signal, not decoration: CTA, selected evidence, active lineage, important finding.
4. Stone Blue belongs to examination / technical context.
5. Dust Rose is optional and should stay below ~5% of visible accent usage.
6. Avoid neon, heavy glow and multicolor gradients.

## Typography
- Display / editorial: Newsreader
- UI / body: Manrope
- IDs / metadata / technical labels: DM Mono

### Hierarchy
- Hero / major screen title: 39–52px Newsreader, tight tracking.
- Section title: 30–43px Newsreader.
- Body: 12–14px Manrope.
- Metadata: 6.5–9px DM Mono, high letter spacing.

## Shape language
- Border radius: 0–3px for archive surfaces; no rounded SaaS cards.
- Borders: thin, low-contrast parchment lines.
- Bronze border only when selection or methodological importance is present.
- Shadows: broad and soft; should read as physical depth, not floating glass.

## Layout rules by workflow step

### 01 Open
Purpose: establish the case and object.
- Object gets dominant visual area.
- Case panel is narrower and calmer.
- Use patina surface behind metadata.
- Bronze CTA is the only strong action color.

### 02 Records
Purpose: navigate source evidence.
- Selected record is the main parchment artifact on the dark archive desk.
- Source status and lighting are visually prioritized.
- Timeline remains an evidence index, not a generic progress bar.

### 03 Inspect
Purpose: instrumented surface examination.
- Vessel remains dominant.
- Grazing control behaves like a physical examination strip.
- Stone Blue supports technical context; Bronze indicates capture readiness/action.
- The canonical vessel and crack remain unchanged from the proof-validated implementation.

### 04 Compare
Purpose: compare documentation quality and conditions.
- A and B are evidence plates, not decorative cards.
- A must honestly show the documentation gap; no fabricated equivalent image.
- B uses the captured observation.
- Limitation block is methodologically prominent.

### 05 Finding
Purpose: make reasoning legible.
- Dedicated full-width reasoning canvas.
- Source → Observation → Comparison → Limitation → Finding is visually continuous.
- The qualified finding receives Bronze emphasis, not neon/glow.

### 06 Record
Purpose: finish on a credible institutional artifact.
- Record is centered on parchment over a smoky/patina review field.
- Generated record should feel printable/archiveable.
- OBS-04 capture and evidence lineage remain visible.

## Component rules

### Primary action
- Bronze fill
- Dark smoky text
- Square/2px radius
- No gradient

### Secondary action
- Transparent or parchment when inside document
- Thin border

### Evidence card
- Dark archive surface by default
- Parchment only for selected/documentary artifacts

### Status
- Verified: sage
- Partial: bronze
- Missing/unavailable: stone / muted

### Evidence lineage
- Dark patina cards
- Bronze connectors
- FND-01 receives strongest border/background emphasis

### Generated record
- Parchment base
- Charcoal text
- Bronze labels / finding accents
- Blue-green only in embedded evidence imagery, not as document chrome

## Motion system
Motion must explain workflow state and evidence transformation. It is not ambient decoration.

### Tool ownership
- **Three.js / R3F** — canonical vessel, examination lighting, raking-light surface response.
- **Framer Motion** — React mount/unmount and short structural transitions.
- **Anime.js** — editorial choreography, staggered evidence reveals, timeline sequencing and signature reasoning-to-record transitions.

### Anime.js rules
- Use `createScope()` inside React so animations stay scoped to the current workflow root and are reverted on step change/unmount.
- Respect `prefers-reduced-motion` through Anime.js scope media queries.
- Prefer 420–650ms for editorial reveals and 40–100ms staggers between related evidence elements.
- Do not animate every label. Animate hierarchy: headline → artifact → metadata → action.
- No ambient looping UI animation.

### V3 choreography by step
- **Open:** hero statement reveals first, then object caption, then case brief.
- **Records:** archive heading → chronology rule → four folios in stagger → selected detail.
- **Inspect:** examination mode → target annotation → grazing-light instrument → review panel.
- **Compare:** A and B enter from opposing sides → relationship rail → limitation/finding.
- **Finding:** lineage nodes activate sequentially from `SRC-03` to `FND-01`, then the qualified finding resolves.
- **Record:** document identity → metadata → observation → finding → lineage → archive/export actions.

## Workflow additions

### AI Color Picker
Use AI Color Picker between visual-direction selection and design-system lock:

`Visual direction → AI Color Picker → palette validation → design system → build → contrast/accessibility QA`

For V3, `#24363A` is the validated primary smoky blue anchor.

### Motion / Differentiation Gate
Anime.js is now a supported execution tool in the permanent Differentiation Gate.

Use the workflow:

`Reference behavior (Rina / 60fps / Sohrab) → define signature behavior → choose execution tool (Anime.js / GSAP / Rive / Three.js) → build → reduced-motion + performance QA`

Selection rule:
- Anime.js: editorial DOM/SVG choreography and sequenced UI transitions.
- GSAP: heavier scroll/complex timeline work when Anime.js is not sufficient.
- Rive: authored interactive vector states.
- Three.js: genuine 3D/object/light interactions.

For Condition Trace V3, the selected combination is **Anime.js + Three.js**, with Framer Motion retained for basic React transitions.
