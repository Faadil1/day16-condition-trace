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

export const COMP_WIDTH = 1920;
export const COMP_HEIGHT = 1080;
export const COMP_FPS = 30;
export const COMP_FRAMES = 930; // 31 seconds

// startFrom: skip the first 5s of loading in the recording (5s × 30fps = 150)
// With startFrom=75: at comp frame 90, video shows t=(75+90)/30 = 5.5s = demo ~0.5s (stable open)
const VIDEO_START_FROM = 75;

// Key composition frames
const T_TITLE_OUT = 90;   // Title fully gone → app visible
const T_OPEN = 90;        // Opening state visible
const T_RECORDS = 180;    // Records step (demo ~3s)
const T_INSPECT = 255;    // Inspect entry (demo ~5.5s)
const T_RAKING = 300;     // Raking light starts (demo ~7s)
const T_CRACK = 450;      // Crack/hold (demo ~12s)
const T_MARK = 525;       // Mark feature (demo ~14.5s)
const T_COMPARE = 600;    // Compare (demo ~17s)
const T_FINDING = 675;    // Finding (demo ~19.5s)
const T_DRAWER = 765;     // Drawer open (demo ~22.5s)
const T_END_START = 855;  // End frame fade in
const T_END_FULL = 900;   // End frame fully visible

// 1440×900 video fitted into 1920×1080 by scaling to fill height
// Scale = 1080/900 = 1.2 → width = 1728, leaving 96px espresso bars each side
const FIT_SCALE = COMP_HEIGHT / 900; // 1.2

function easeInOut(x: number) {
  return Easing.inOut(Easing.quad)(x);
}

export const ConditionTraceFinal: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Title card opacity
  const titleOpacity = interpolate(
    frame, [0, 15, 60, T_TITLE_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut }
  );

  // ── App video opacity (fades in as title fades out)
  const videoOpacity = interpolate(
    frame, [60, T_TITLE_OUT],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Camera scale: slow push → zoom during raking → settle for finding
  const cameraScale = interpolate(
    frame,
    [T_OPEN, T_RECORDS, T_RAKING, T_CRACK, T_MARK, T_END_START],
    [FIT_SCALE, FIT_SCALE * 1.04, FIT_SCALE * 1.04, FIT_SCALE * 1.09, FIT_SCALE * 1.02, FIT_SCALE],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut }
  );

  // ── Camera vertical drift: nudge up during raking to keep vessel centred at higher scale
  const cameraY = interpolate(
    frame,
    [T_RAKING, T_CRACK, T_MARK],
    [0, -22, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut }
  );

  // ── Editorial label visibility
  const label1Opacity = interpolate(
    frame, [T_RECORDS, T_RECORDS + 15, T_INSPECT - 15, T_INSPECT],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const label2Opacity = interpolate(
    frame, [T_RAKING, T_RAKING + 15, T_RAKING + 75, T_RAKING + 90],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const label3Opacity = interpolate(
    frame, [T_FINDING, T_FINDING + 15, T_DRAWER - 15, T_DRAWER],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── End frame opacity
  const endOpacity = interpolate(
    frame, [T_END_START, T_END_FULL],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#1D1210', fontFamily: 'sans-serif' }}>

      {/* ── App video layer */}
      <AbsoluteFill style={{ opacity: videoOpacity }}>
        {/* Espresso side bars */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: 96, height: COMP_HEIGHT,
          background: '#1D1210',
          zIndex: 1,
        }} />
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 96, height: COMP_HEIGHT,
          background: '#1D1210',
          zIndex: 1,
        }} />
        {/* Video container with camera movement */}
        <div
          style={{
            position: 'absolute',
            width: 1440,
            height: 900,
            left: '50%',
            top: '50%',
            transform: `translate(-50%, ${-50 + (cameraY / COMP_HEIGHT) * 100}%) scale(${cameraScale})`,
            transformOrigin: 'center center',
          }}
        >
          <OffthreadVideo
            src={staticFile('live-condition-trace-capture.webm')}
            startFrom={VIDEO_START_FROM}
            endAt={800}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>
      </AbsoluteFill>

      {/* ── Title card */}
      {titleOpacity > 0.01 && (
        <AbsoluteFill style={{ opacity: titleOpacity, zIndex: 10 }}>
          <Title />
        </AbsoluteFill>
      )}

      {/* ── Editorial labels */}
      {label1Opacity > 0.01 && (
        <Label opacity={label1Opacity} text="REVIEW THE RECORD CHAIN" />
      )}
      {label2Opacity > 0.01 && (
        <Label opacity={label2Opacity} text="CHANGE THE EXAMINATION CONDITION" />
      )}
      {label3Opacity > 0.01 && (
        <Label opacity={label3Opacity} text="IDENTIFY FIRST DOCUMENTED APPEARANCE" />
      )}

      {/* ── End frame */}
      {endOpacity > 0.01 && (
        <AbsoluteFill style={{ opacity: endOpacity, zIndex: 20 }}>
          <EndFrame />
        </AbsoluteFill>
      )}

      {/* ── Audio */}
      <Audio src={staticFile('audio/main-audio.wav')} />

    </AbsoluteFill>
  );
};
