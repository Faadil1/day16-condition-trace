import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

const cells = [
  ['1s', 'qc/f01-title.png'],
  ['4s', 'qc/f02-open.png'],
  ['8s', 'qc/f03-records.png'],
  ['13s', 'qc/f04-raking.png'],
  ['18.5s', 'qc/f05-obs04.png'],
  ['23s', 'qc/f06-compare.png'],
  ['29s', 'qc/f07-trace.png'],
  ['34s', 'qc/f08-record.png'],
  ['37s', 'qc/f09-end.png'],
];

export const ContactSheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#120c09', color: '#f3e1be', fontFamily: 'Georgia, serif', padding: 42 }}>
    <div style={{ fontSize: 32, letterSpacing: '0.18em', marginBottom: 20 }}>DAY 16 FINAL CUT QC</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
      {cells.map(([label, src]) => (
        <div key={src} style={{ background: '#1a110d', border: '1px solid rgba(181,138,89,0.45)', padding: 8 }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', background: '#000' }}>
            <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 14, letterSpacing: '0.18em', color: '#b58a59' }}>{label}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
