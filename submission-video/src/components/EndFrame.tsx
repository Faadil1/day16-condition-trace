import React from 'react';
import { AbsoluteFill } from 'remotion';

export const EndFrame: React.FC = () => (
  <AbsoluteFill style={{ background: '#1D1210', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
    <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 50, fontWeight: 700, letterSpacing: '0.2em', color: '#FFDCE8', textTransform: 'uppercase', textAlign: 'center' }}>
      CONDITION TRACE
    </div>
    <div style={{ width: 80, height: 1, background: '#FFDCE8', opacity: 0.22 }} />
    <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 16, letterSpacing: '0.18em', color: '#B58A59', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.9 }}>
      TRACE THE RECORD.<br />NOT THE BLAME.
    </div>
    <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 13, letterSpacing: '0.16em', color: '#FFDCE8', opacity: 0.62, textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.8 }}>
      DAY 16<br />30 DAYS OF REAL BUSINESS PROBLEMS
    </div>
  </AbsoluteFill>
);
