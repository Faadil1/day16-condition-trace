import React from 'react';
import { AbsoluteFill } from 'remotion';

export const EndFrame: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: '#1D1210',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
      }}
    >
      {/* Product name */}
      <div
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: '0.22em',
          color: '#FFDCE8',
          textTransform: 'uppercase',
        }}
      >
        CONDITION TRACE
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 16,
          fontWeight: 400,
          letterSpacing: '0.18em',
          color: '#B58A59',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        TRACE THE RECORD. NOT THE BLAME.
      </div>

      {/* Divider */}
      <div style={{ width: 80, height: 1, background: '#FFDCE8', opacity: 0.25 }} />

      {/* Series credit */}
      <div
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 13,
          fontWeight: 400,
          letterSpacing: '0.14em',
          color: '#FFDCE8',
          opacity: 0.6,
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 2,
        }}
      >
        Day 16 — 30 Days of Real Business Problems
        <br />
        day16-condition-trace.vercel.app
      </div>
    </AbsoluteFill>
  );
};
