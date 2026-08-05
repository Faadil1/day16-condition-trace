import React from 'react';
import { AbsoluteFill } from 'remotion';

export const CoverSquare: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: '#1D1210',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      {/* Day label */}
      <div
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 13,
          fontWeight: 400,
          letterSpacing: '0.4em',
          color: '#B58A59',
          textTransform: 'uppercase',
        }}
      >
        DAY 16 / 30
      </div>

      {/* Product name */}
      <div
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#FFDCE8',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.05,
        }}
      >
        CONDITION
        <br />
        TRACE
      </div>

      {/* Rule */}
      <div style={{ width: 48, height: 1, background: '#B58A59', opacity: 0.7 }} />

      {/* Tagline */}
      <div
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 13,
          fontWeight: 400,
          letterSpacing: '0.22em',
          color: '#FFDCE8',
          opacity: 0.65,
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 2,
        }}
      >
        TRACE THE RECORD.
        <br />
        NOT THE BLAME.
      </div>
    </AbsoluteFill>
  );
};
