# Condition Trace

**Day 16 of “30 Days of Real Business Problems”**

## Live Demo

[https://day16-condition-trace.vercel.app](https://day16-condition-trace.vercel.app)

## GitHub

[https://github.com/Faadil1/day16-condition-trace](https://github.com/Faadil1/day16-condition-trace)

> Best viewed on desktop at 1440 × 900. All institutions, objects, and records are fictional.
> The system identifies the **first documented appearance** of a feature in the record chain — not physical cause or liability.

---

A polished desktop prototype for Day 16 of the “30 Days of Real Business Problems” challenge.

## Purpose

Condition Trace helps a conservator or trained registrar review the documentation chain for a museum object returned from loan. It brings condition reports, examination conditions, evidence status, and handoff moments into one human-reviewed workflow.

## Business problem and reframe

When a newly observed condition feature appears during return inspection, evidence is often distributed across institutions and records. The product does not determine where physical damage occurred or who is responsible.

The professional reframe is: **do not trace where the damage occurred; trace when the feature first appears in the documentation record.**

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

1. Open the object and begin the return inspection.
2. Select each of the four moments in the expanded record chain.
3. Start the current-condition inspection and move the raking-light slider toward a shallow angle.
4. Once the feature is legible, mark it as observed.
5. Review the aligned, human-reviewed documentation comparison.
6. Inspect the qualified first-documented-appearance finding and the period requiring review.
7. Generate the archival evidence record and export it as a local JSON file.

## Professional limitations

- The visualization does not automatically detect or classify a crack.
- Absence from a photograph does not prove physical absence.
- Earlier diffuse-light documentation is not equivalent to the return raking-light examination.
- The highlighted period is a period requiring review, not a claim about when a feature physically occurred.
- No determination of cause or liability is made by this record.
- The output is not a legal or insurance determination.

## Fictional data

North Archive Museum, Alder House Museum, Meridian Fine Art Logistics, the object, and every record in this prototype are fictional demonstration data.
