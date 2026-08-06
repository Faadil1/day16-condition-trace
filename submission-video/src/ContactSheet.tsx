/**
 * ContactSheet — 1920×1080 QC contact sheet.
 * Displays 8 frame thumbnails in a 4×2 grid, each labelled with timestamp.
 * Frames are pre-rendered PNGs stored in assets/contact-frames/.
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

const FRAMES = [
  { file: 'frame-0090.png', label: '3 s — Opening object' },
  { file: 'frame-0210.png', label: '7 s — Record chain' },
  { file: 'frame-0360.png', label: '12 s — Raking light' },
  { file: 'frame-0480.png', label: '16 s — Crack visible' },
  { file: 'frame-0630.png', label: '21 s — Compare' },
  { file: 'frame-0720.png', label: '24 s — Finding' },
  { file: 'frame-0810.png', label: '27 s — Evidence drawer' },
  { file: 'frame-0900.png', label: '30 s — End card' },
];

const CELL_W = 460;
const CELL_H = 259; // 460 × 9/16 = 258.75

export const ContactSheet: React.FC = () => (
  <AbsoluteFill style={{ background: '#0E0908', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0 }}>

    {/* Header */}
    <div style={{
      width: '100%',
      padding: '20px 40px 12px',
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
    }}>
      <div style={{
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: 14, fontWeight: 700, letterSpacing: '0.22em',
        color: '#FFDCE8', textTransform: 'uppercase',
      }}>
        CONDITION TRACE — QC CONTACT SHEET
      </div>
      <div style={{
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: 11, color: '#B58A59', letterSpacing: '0.16em', textTransform: 'uppercase',
      }}>
        1920×1080 · 30 fps · H.264 · 31 s
      </div>
    </div>

    {/* Grid */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 4,
      padding: '4px 24px 16px',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {FRAMES.map(({ file, label }) => (
        <div key={file} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
            <Img
              src={staticFile(`contact-frames/${file}`)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 10, color: '#B58A59', letterSpacing: '0.14em',
            textTransform: 'uppercase', padding: '5px 4px 0',
          }}>
            {label}
          </div>
        </div>
      ))}
    </div>

  </AbsoluteFill>
);
