import React from 'react';
import { AbsoluteFill } from 'remotion';

export const Title: React.FC = () => {
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
          fontSize: 18,
          fontWeight: 400,
          letterSpacing: '0.35em',
          color: '#B58A59',
          textTransform: 'uppercase',
        }}
      >
        DAY 16
      </div>

      {/* Rule */}
      <div
        style={{
          width: 64,
          height: 1,
          background: '#FFDCE8',
          opacity: 0.4,
        }}
      />

      {/* Title */}
      <div
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 48,
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: '#FFDCE8',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        CONDITION TRACE
      </div>
    </AbsoluteFill>
  );
};
