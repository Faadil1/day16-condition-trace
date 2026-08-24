import React from 'react';
import { AbsoluteFill } from 'remotion';

export const Title: React.FC = () => (
  <AbsoluteFill style={{ background: '#1D1210', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
    <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 16, letterSpacing: '0.42em', color: '#B58A59', textTransform: 'uppercase' }}>DAY 16</div>
    <div style={{ width: 66, height: 1, background: '#FFDCE8', opacity: 0.34 }} />
    <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 46, fontWeight: 700, letterSpacing: '0.18em', color: '#FFDCE8', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.08 }}>
      CONDITION TRACE
    </div>
    <div style={{ marginTop: 8, fontFamily: '"Courier New", Courier, monospace', fontSize: 14, letterSpacing: '0.18em', color: '#FFDCE8', opacity: 0.75, textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.7 }}>
      TRACE THE RECORD.<br />NOT THE BLAME.
    </div>
  </AbsoluteFill>
);
