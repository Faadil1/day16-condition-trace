import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  OffthreadVideo,
  Audio,
  staticFile,
} from 'remotion';
import { Title } from './components/Title';
import { Label } from './components/Label';
import { EndFrame } from './components/EndFrame';

export const COMP_WIDTH = 1920;
export const COMP_HEIGHT = 1080;
export const COMP_FPS = 30;
export const COMP_FRAMES = 990;

const SETUP_FR = 240;
const PILLAR = 96;
const SCALE = COMP_HEIGHT / 900;
const FADE = 4;

const VideoClip: React.FC<{ src: string; seqDuration: number }> = ({ src, seqDuration }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, FADE, seqDuration - FADE, seqDuration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: '#1D1210' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: PILLAR, height: COMP_HEIGHT, background: '#1D1210', zIndex: 1 }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: PILLAR, height: COMP_HEIGHT, background: '#1D1210', zIndex: 1 }} />
      <div style={{ position: 'absolute', width: 1440, height: 900, left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${SCALE})`, transformOrigin: 'center center' }}>
        <OffthreadVideo src={src} startFrom={SETUP_FR} endAt={SETUP_FR + seqDuration} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
    </AbsoluteFill>
  );
};

export const ConditionTraceFinalV3: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 12, 78, 90], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const endOpacity = interpolate(frame, [911, 927], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const label1Opacity = interpolate(frame, [185, 197, 238, 250], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const label2Opacity = interpolate(frame, [280, 292, 368, 380], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const label3Opacity = interpolate(frame, [695, 707, 763, 775], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#1D1210' }}>
      <Sequence from={86} durationInFrames={79}><VideoClip src={staticFile('segments/01-open-object.webm')} seqDuration={79} /></Sequence>
      <Sequence from={161} durationInFrames={94}><VideoClip src={staticFile('segments/02-review-record-chain.webm')} seqDuration={94} /></Sequence>
      <Sequence from={251} durationInFrames={334}><VideoClip src={staticFile('segments/03-raking-reveal.webm')} seqDuration={334} /></Sequence>
      <Sequence from={581} durationInFrames={94}><VideoClip src={staticFile('segments/04-compare-documentation.webm')} seqDuration={94} /></Sequence>
      <Sequence from={671} durationInFrames={109}><VideoClip src={staticFile('segments/05-first-documented-appearance.webm')} seqDuration={109} /></Sequence>
      <Sequence from={776} durationInFrames={139}><VideoClip src={staticFile('segments/06-evidence-drawer.webm')} seqDuration={139} /></Sequence>

      {titleOpacity > 0.01 && <AbsoluteFill style={{ opacity: titleOpacity, zIndex: 10 }}><Title /></AbsoluteFill>}
      {label1Opacity > 0.01 && <Label opacity={label1Opacity} text="TRACE THE DOCUMENTATION" />}
      {label2Opacity > 0.01 && <Label opacity={label2Opacity} text="CHANGE THE EXAMINATION CONDITION" />}
      {label3Opacity > 0.01 && <Label opacity={label3Opacity} text="TRACE THE EVIDENCE" />}
      {endOpacity > 0.01 && <AbsoluteFill style={{ opacity: endOpacity, zIndex: 20 }}><EndFrame /></AbsoluteFill>}
      <Audio src={staticFile('audio/main-audio.wav')} />
    </AbsoluteFill>
  );
};
