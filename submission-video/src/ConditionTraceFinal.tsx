import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;
export const DURATION = 2700; // 90 seconds

const VIDEO_W = 1920;
const VIDEO_H = 1080;

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 18, 72, 90], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity, background: 'linear-gradient(180deg, #120c09 0%, #1f1410 100%)', color: '#f5e4c8', fontFamily: 'Georgia, serif' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 35%, rgba(181,138,89,0.16), transparent 42%)' }} />
      <div style={{ position: 'absolute', left: 96, top: 88, letterSpacing: '0.4em', color: '#b58a59', fontSize: 22 }}>CONDITION TRACE</div>
      <div style={{ position: 'absolute', left: 96, top: 150, fontSize: 58, fontWeight: 700, letterSpacing: '0.08em', lineHeight: 1.05, maxWidth: 980 }}>Canonical V3 - Live Workflow Verification</div>
      <div style={{ position: 'absolute', left: 96, top: 330, fontSize: 24, letterSpacing: '0.2em', color: '#e7d2ad' }}>CT-1847 / Return Examination</div>
      <div style={{ position: 'absolute', left: 96, top: 394, width: 180, height: 1, background: '#b58a59', opacity: 0.7 }} />
    </AbsoluteFill>
  );
};

const FooterCard: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12, 72, 90], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity, background: 'linear-gradient(180deg, #120c09 0%, #1a110d 100%)', color: '#f5e4c8', fontFamily: 'Georgia, serif' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 35%, rgba(181,138,89,0.14), transparent 38%)' }} />
      <div style={{ position: 'absolute', left: 96, top: 100, fontSize: 52, fontWeight: 700, letterSpacing: '0.08em' }}>Condition Trace</div>
      <div style={{ position: 'absolute', left: 96, top: 200, fontSize: 24, letterSpacing: '0.16em', color: '#b58a59' }}>Trace the record. Not the blame.</div>
      <div style={{ position: 'absolute', left: 96, top: 275, fontSize: 22, letterSpacing: '0.18em' }}>Canonical V3 live verification</div>
      <div style={{ position: 'absolute', left: 96, top: 320, fontSize: 18, letterSpacing: '0.14em', opacity: 0.8 }}>Day 16 - 30 Days of Real Business Problems</div>
    </AbsoluteFill>
  );
};

export const CanonicalV3Verification: React.FC = () => {
  const frame = useCurrentFrame();
  const videoOpacity = interpolate(frame, [84, 96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const outroOpacity = interpolate(frame, [2550, 2580], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#120c09' }}>
      <Sequence from={0} durationInFrames={90}><TitleCard /></Sequence>
      <Sequence from={90} durationInFrames={2460}>
        <AbsoluteFill style={{ backgroundColor: '#120c09' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <div style={{ width: VIDEO_W, height: VIDEO_H, transform: 'scale(1)', transformOrigin: 'center center' }}>
              <OffthreadVideo src={staticFile('canonical-v3-live/canonical-v3-live-recording.webm')} startFrom={0} endAt={2460} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
          <div style={{ position: 'absolute', left: 84, top: 52, letterSpacing: '0.22em', color: '#b58a59', fontFamily: 'Georgia, serif', fontSize: 18 }}>LIVE APP CAPTURE</div>
          <div style={{ position: 'absolute', left: 84, top: 86, letterSpacing: '0.15em', color: '#f3e1be', fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700 }}>Authenticated V3 deployment</div>
          <div style={{ position: 'absolute', right: 84, bottom: 48, fontFamily: 'Georgia, serif', fontSize: 16, letterSpacing: '0.16em', color: '#b58a59' }}>Step-by-step browser recording</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={2550} durationInFrames={150}><FooterCard /></Sequence>
      <Audio src={staticFile('audio/main-audio.wav')} />
    </AbsoluteFill>
  );
};
