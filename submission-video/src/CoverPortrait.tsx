/**
 * CoverPortrait — 1080×1350 editorial submission cover.
 * Background: real app screenshot at raking-light state (vessel + crack visible).
 * Overlay: Espresso gradient + Condition Trace archival typography.
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

export const CoverPortrait: React.FC = () => {
  // Source image: 1440×900 app screenshot.
  // Scale to fill height 1350 → width = 1440 × (1350/900) = 2160.
  // Offset X to centre on the vessel (roughly left 50% of the app).
  const scaledW = Math.round(1440 * (1350 / 900)); // 2160
  const scaledH = 1350;
  // Vessel is at approx x=470 in original (centre of ObjectStage).
  // In scaled image: 470 × 1.5 = 705. Crop 1080 centred there:
  const offsetX = -(705 - 1080 / 2); // -165

  return (
    <AbsoluteFill style={{ background: '#1D1210', overflow: 'hidden' }}>

      {/* App screenshot background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <Img
          src={staticFile('cover-raking-bg.png')}
          style={{
            position: 'absolute',
            width: scaledW,
            height: scaledH,
            left: offsetX,
            top: 0,
            imageRendering: 'auto',
          }}
        />
      </div>

      {/* Bottom gradient veil — Espresso ink, opaque at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0,
        width: '100%', height: '55%',
        background: 'linear-gradient(to bottom, rgba(29,18,16,0) 0%, rgba(29,18,16,0.82) 45%, rgba(29,18,16,0.97) 100%)',
      }} />

      {/* Top vignette */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '15%',
        background: 'linear-gradient(to top, rgba(29,18,16,0) 0%, rgba(29,18,16,0.55) 100%)',
      }} />

      {/* Editorial text block */}
      <div style={{
        position: 'absolute',
        bottom: 80, left: 72, right: 72,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20,
      }}>
        {/* Kicker */}
        <div style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 13, fontWeight: 400, letterSpacing: '0.42em',
          color: '#B58A59', textTransform: 'uppercase',
        }}>
          DAY 16 / 30 — 30 DAYS OF REAL BUSINESS PROBLEMS
        </div>

        {/* Primary title */}
        <div style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 62, fontWeight: 700, letterSpacing: '0.14em',
          color: '#FFDCE8', textTransform: 'uppercase', lineHeight: 1.05,
        }}>
          CONDITION<br />TRACE
        </div>

        {/* Rule */}
        <div style={{ width: 52, height: 1, background: '#B58A59', opacity: 0.75 }} />

        {/* Tagline */}
        <div style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 15, fontWeight: 400, letterSpacing: '0.20em',
          color: '#FFDCE8', opacity: 0.72, textTransform: 'uppercase', lineHeight: 1.9,
        }}>
          TRACE THE RECORD.<br />NOT THE BLAME.
        </div>

        {/* Record chain detail line */}
        <div style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 11, fontWeight: 400, letterSpacing: '0.18em',
          color: '#B58A59', opacity: 0.65, textTransform: 'uppercase',
          marginTop: 4,
        }}>
          CT-1847 · FIRST DOCUMENTED APPEARANCE · AUG 2026
        </div>
      </div>

    </AbsoluteFill>
  );
};
