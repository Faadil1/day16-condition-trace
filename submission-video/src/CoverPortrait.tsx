import React from 'react';
import { AbsoluteFill } from 'remotion';

export const CoverPortrait: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: '#1D1210',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        padding: '80px 60px',
      }}
    >
      {/* Day badge */}
      <div
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 14,
          fontWeight: 400,
          letterSpacing: '0.4em',
          color: '#B58A59',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        DAY 16 / 30
      </div>

      {/* Product name */}
      <div
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 68,
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#FFDCE8',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.08,
        }}
      >
        CONDITION
        <br />
        TRACE
      </div>

      {/* Rule */}
      <div style={{ width: 56, height: 1, background: '#B58A59', opacity: 0.7 }} />

      {/* Tagline */}
      <div
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 15,
          fontWeight: 400,
          letterSpacing: '0.22em',
          color: '#FFDCE8',
          opacity: 0.7,
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.9,
        }}
      >
        TRACE THE RECORD.
        <br />
        NOT THE BLAME.
      </div>

      {/* Bottom descriptor */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 12,
          fontWeight: 400,
          letterSpacing: '0.18em',
          color: '#B58A59',
          textTransform: 'uppercase',
          opacity: 0.8,
        }}
      >
        30 DAYS OF REAL BUSINESS PROBLEMS
      </div>
    </AbsoluteFill>
  );
};
