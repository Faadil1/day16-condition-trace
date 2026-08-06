/**
 * CoverSquare — 1080×1080 editorial square cover.
 * Background: real app screenshot at raking-light state (vessel + crack).
 * Recomposed (not just cropped) to keep vessel and Rose Silk band readable.
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

export const CoverSquare: React.FC = () => {
  // Scale 1440×900 to fill height 1080 → width = 1440 × (1080/900) = 1728.
  // Show left portion (vessel area).
  const scaledW = Math.round(1440 * (1080 / 900)); // 1728
  const scaledH = 1080;
  // Vessel centre at original x≈470 → scaled x = 470 × 1.2 = 564.
  // Crop 1080 centred there: offsetX = -(564 - 540) = -24
  const offsetX = -24;

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

      {/* Bottom gradient veil */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, width: '100%', height: '48%',
        background: 'linear-gradient(to bottom, rgba(29,18,16,0) 0%, rgba(29,18,16,0.80) 40%, rgba(29,18,16,0.96) 100%)',
      }} />

      {/* Top bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '12%',
        background: 'linear-gradient(to top, rgba(29,18,16,0) 0%, rgba(29,18,16,0.60) 100%)',
      }} />

      {/* DAY badge — top-left */}
      <div style={{
        position: 'absolute',
        top: 48, left: 56,
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: 12, fontWeight: 400, letterSpacing: '0.38em',
        color: '#B58A59', textTransform: 'uppercase',
      }}>
        DAY 16 / 30
      </div>

      {/* Bottom text block */}
      <div style={{
        position: 'absolute',
        bottom: 64, left: 56, right: 56,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16,
      }}>
        {/* Title */}
        <div style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 58, fontWeight: 700, letterSpacing: '0.15em',
          color: '#FFDCE8', textTransform: 'uppercase', lineHeight: 1.05,
        }}>
          CONDITION<br />TRACE
        </div>

        {/* Rule */}
        <div style={{ width: 44, height: 1, background: '#B58A59', opacity: 0.75 }} />

        {/* Tagline */}
        <div style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 13, fontWeight: 400, letterSpacing: '0.20em',
          color: '#FFDCE8', opacity: 0.70, textTransform: 'uppercase',
        }}>
          TRACE THE RECORD. NOT THE BLAME.
        </div>
      </div>

    </AbsoluteFill>
  );
};
