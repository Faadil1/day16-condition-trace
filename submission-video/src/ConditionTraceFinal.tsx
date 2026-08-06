import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  OffthreadVideo,
  Audio,
  staticFile,
  Easing,
} from 'remotion';
import { Title } from './components/Title';
import { Label } from './components/Label';
import { EndFrame } from './components/EndFrame';

export const COMP_WIDTH  = 1920;
export const COMP_HEIGHT = 1080;
export const COMP_FPS    = 30;
export const COMP_FRAMES = 930; // 31 seconds

// startFrom=30: skip 1 s of browser launch noise in the recording.
// At comp frame F, the video shows its (F+30)/30-second mark.
// Alignment table (all in seconds):
//   comp 2.5 → video 3.5  : opening state visible (title fading)
//   comp 5.0 → video 6.0  : records state
//   comp 8.0 → video 9.0  : inspect state
//   comp 9.0 → video 10.0 : first ArrowRight press
//   comp 17.0→ video 18.0 : crack+mark-CTA hold
//   comp 20.0→ video 21.0 : compare state
//   comp 23.0→ video 24.0 : finding state
//   comp 26.0→ video 27.0 : evidence drawer
//   comp 29.0→ video 30.0 : end card fully covers
const VIDEO_START_FROM = 30;
// Stop reading video at comp frame 900 (video 31 s); end card is fully opaque from 900 onward.
const VIDEO_END_AT = 900;

// Key composition frames
const T_TITLE_OUT  = 90;   // 3.0s: title fully faded
const T_RECORDS    = 150;  // 5.0s: records state
const T_INSPECT    = 240;  // 8.0s: inspect state
const T_CRACK      = 450;  // 15.0s: crack visible (84° ≈ 86% opacity)
const T_MARK       = 510;  // 17.0s: mark-observed-feature CTA hold
const T_COMPARE    = 600;  // 20.0s: compare state
const T_FINDING    = 690;  // 23.0s: finding state
const T_DRAWER     = 780;  // 26.0s: evidence drawer
const T_END_START  = 870;  // 29.0s: end card fades in
const T_END_FULL   = 900;  // 30.0s: end card fully covers

// 1440×900 recording scaled to fill 1920×1080 height → scale 1.2
// Width 1440×1.2 = 1728; side bars 96 px each (espresso fill)
const FIT = COMP_HEIGHT / 900; // 1.2

const ease = (x: number) => Easing.inOut(Easing.quad)(x);

export const ConditionTraceFinal: React.FC = () => {
  const frame = useCurrentFrame();

  // Title card
  const titleOpacity = interpolate(
    frame, [0, 12, 60, T_TITLE_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }
  );

  // App video fades in as title fades
  const videoOpacity = interpolate(
    frame, [60, T_TITLE_OUT],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Camera scale: slow push during records → tighter for raking → settle for drawer
  const cameraScale = interpolate(
    frame,
    [75,   T_RECORDS, T_INSPECT, T_CRACK, T_MARK, T_COMPARE, T_FINDING, T_DRAWER, T_END_START],
    [FIT,  FIT*1.03,  FIT*1.04,  FIT*1.09, FIT*1.07, FIT*1.04, FIT*1.03, FIT*1.02, FIT],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }
  );

  // Vertical drift: nudge up slightly during raking so vessel stays centred
  const cameraY = interpolate(
    frame,
    [T_INSPECT, T_CRACK, T_MARK],
    [0, -18, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }
  );

  // Editorial labels
  const label1Opacity = interpolate(   // "REVIEW THE RECORD CHAIN" — records step
    frame, [T_RECORDS + 12, T_RECORDS + 24, T_INSPECT - 18, T_INSPECT],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const label2Opacity = interpolate(   // "CHANGE THE EXAMINATION CONDITION" — raking
    frame, [T_INSPECT + 30, T_INSPECT + 45, T_CRACK - 18, T_CRACK],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const label3Opacity = interpolate(   // "IDENTIFY FIRST DOCUMENTED APPEARANCE" — finding
    frame, [T_FINDING + 12, T_FINDING + 24, T_DRAWER - 18, T_DRAWER],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // End card
  const endOpacity = interpolate(
    frame, [T_END_START, T_END_FULL],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#1D1210', fontFamily: 'sans-serif' }}>

      {/* ── App video ─────────────────────────────────────────────── */}
      <AbsoluteFill style={{ opacity: videoOpacity }}>
        {/* Espresso pillar bars */}
        <div style={{ position: 'absolute', top: 0, left:  0, width: 96, height: COMP_HEIGHT, background: '#1D1210', zIndex: 1 }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 96, height: COMP_HEIGHT, background: '#1D1210', zIndex: 1 }} />
        {/* Camera-rig container */}
        <div style={{
          position: 'absolute',
          width: 1440, height: 900,
          left: '50%', top: '50%',
          transform: `translate(-50%, calc(-50% + ${cameraY}px)) scale(${cameraScale})`,
          transformOrigin: 'center center',
        }}>
          <OffthreadVideo
            src={staticFile('live-condition-trace-capture.webm')}
            startFrom={VIDEO_START_FROM}
            endAt={VIDEO_END_AT}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>
      </AbsoluteFill>

      {/* ── Title card ────────────────────────────────────────────── */}
      {titleOpacity > 0.01 && (
        <AbsoluteFill style={{ opacity: titleOpacity, zIndex: 10 }}>
          <Title />
        </AbsoluteFill>
      )}

      {/* ── Editorial labels ──────────────────────────────────────── */}
      {label1Opacity > 0.01 && (
        <Label opacity={label1Opacity} text="REVIEW THE RECORD CHAIN" />
      )}
      {label2Opacity > 0.01 && (
        <Label opacity={label2Opacity} text="CHANGE THE EXAMINATION CONDITION" />
      )}
      {label3Opacity > 0.01 && (
        <Label opacity={label3Opacity} text="IDENTIFY FIRST DOCUMENTED APPEARANCE" />
      )}

      {/* ── End card ──────────────────────────────────────────────── */}
      {endOpacity > 0.01 && (
        <AbsoluteFill style={{ opacity: endOpacity, zIndex: 20 }}>
          <EndFrame />
        </AbsoluteFill>
      )}

      {/* ── Audio ─────────────────────────────────────────────────── */}
      <Audio src={staticFile('audio/main-audio.wav')} />

    </AbsoluteFill>
  );
};
