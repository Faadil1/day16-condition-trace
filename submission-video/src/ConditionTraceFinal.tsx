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

export const COMP_WIDTH  = 1920;
export const COMP_HEIGHT = 1080;
export const COMP_FPS    = 30;
export const COMP_FRAMES = 990; // 33 seconds

// ── Segment layout (6 verified WebM clips + title + end card) ────────────────
//
// All clips recorded with 8-second setup window → startFrom=240 for every clip.
// 4-frame cross-dissolves at each boundary (overlapping sequences).
//
// Comp frames:   0  86 161 251  581  671  776 911  990
// Seconds:       0  2.9  5.4  8.4  19.4  22.4  25.9  30.4  33.0
//
//  [Title 0-90] ──────────────────────────────────────────
//              [01  86-165] (open object, 2.5s)
//                         [02  161-255] (records, 3s)
//                                  [03  251-585] (raking, 11s)
//                                               [04 581-675] (compare, 3s)
//                                                           [05 671-780] (finding, 3.5s)
//                                                                     [06 776-915] (drawer, 4.5s)
//                                                                                [End 911-990]

const SETUP_FR = 240; // 8-second setup → content window starts at video frame 240
const PILLAR   = 96;  // (1920 - 1440 × 1.2) / 2  — espresso side bars
const SCALE    = COMP_HEIGHT / 900; // 1.2

// ── VideoClip ─────────────────────────────────────────────────────────────────
// Renders one segment video with a 4-frame fade-in and 4-frame fade-out.
// startFrom skips the 8-second setup captured in each WebM.
// endAt is a safety stop (= startFrom + seqDuration).
const FADE = 4;

const VideoClip: React.FC<{
  src: string;
  seqDuration: number;
}> = ({ src, seqDuration }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, FADE, seqDuration - FADE, seqDuration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: '#1D1210' }}>
      {/* Espresso pillar bars hide side overflow from the 1.2× scale */}
      <div style={{ position: 'absolute', top: 0, left:  0, width: PILLAR, height: COMP_HEIGHT, background: '#1D1210', zIndex: 1 }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: PILLAR, height: COMP_HEIGHT, background: '#1D1210', zIndex: 1 }} />
      {/* Scaled video: 1440×900 → 1728×1080, centred */}
      <div style={{
        position: 'absolute',
        width: 1440, height: 900,
        left: '50%', top: '50%',
        transform: `translate(-50%, -50%) scale(${SCALE})`,
        transformOrigin: 'center center',
      }}>
        <OffthreadVideo
          src={src}
          startFrom={SETUP_FR}
          endAt={SETUP_FR + seqDuration}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Main composition ──────────────────────────────────────────────────────────
export const ConditionTraceFinal: React.FC = () => {
  const frame = useCurrentFrame();

  // Title card: fades in 0-12, holds, fades out 78-90
  const titleOpacity = interpolate(
    frame, [0, 12, 78, 90],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // End card: fades in starting at frame 911 (overlaps last 4 frames of SEQ06)
  const endOpacity = interpolate(
    frame, [911, 927],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Editorial labels (visible mid-segment, clear of cross-dissolve zones)
  const label1Opacity = interpolate(  // "REVIEW THE RECORD CHAIN" — records step
    frame, [185, 197, 238, 250],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const label2Opacity = interpolate(  // "CHANGE THE EXAMINATION CONDITION" — raking
    frame, [280, 292, 368, 380],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const label3Opacity = interpolate(  // "IDENTIFY FIRST DOCUMENTED APPEARANCE" — finding
    frame, [695, 707, 763, 775],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#1D1210' }}>

      {/* ── Video segments (overlapping Sequences for 4-frame cross-dissolves) ── */}

      {/* SEQ01 — Open object: from=86, dur=79 (86→165) */}
      <Sequence from={86} durationInFrames={79}>
        <VideoClip src={staticFile('segments/01-open-object.webm')} seqDuration={79} />
      </Sequence>

      {/* SEQ02 — Review record chain: from=161, dur=94 (161→255) */}
      <Sequence from={161} durationInFrames={94}>
        <VideoClip src={staticFile('segments/02-review-record-chain.webm')} seqDuration={94} />
      </Sequence>

      {/* SEQ03 — Raking reveal + hold: from=251, dur=334 (251→585) */}
      <Sequence from={251} durationInFrames={334}>
        <VideoClip src={staticFile('segments/03-raking-reveal.webm')} seqDuration={334} />
      </Sequence>

      {/* SEQ04 — Compare documentation: from=581, dur=94 (581→675) */}
      <Sequence from={581} durationInFrames={94}>
        <VideoClip src={staticFile('segments/04-compare-documentation.webm')} seqDuration={94} />
      </Sequence>

      {/* SEQ05 — First documented appearance: from=671, dur=109 (671→780) */}
      <Sequence from={671} durationInFrames={109}>
        <VideoClip src={staticFile('segments/05-first-documented-appearance.webm')} seqDuration={109} />
      </Sequence>

      {/* SEQ06 — Generated evidence drawer: from=776, dur=139 (776→915) */}
      <Sequence from={776} durationInFrames={139}>
        <VideoClip src={staticFile('segments/06-evidence-drawer.webm')} seqDuration={139} />
      </Sequence>

      {/* ── Title card ─────────────────────────────────────────────────────── */}
      {titleOpacity > 0.01 && (
        <AbsoluteFill style={{ opacity: titleOpacity, zIndex: 10 }}>
          <Title />
        </AbsoluteFill>
      )}

      {/* ── Editorial labels ────────────────────────────────────────────────── */}
      {label1Opacity > 0.01 && <Label opacity={label1Opacity} text="REVIEW THE RECORD CHAIN" />}
      {label2Opacity > 0.01 && <Label opacity={label2Opacity} text="CHANGE THE EXAMINATION CONDITION" />}
      {label3Opacity > 0.01 && <Label opacity={label3Opacity} text="IDENTIFY FIRST DOCUMENTED APPEARANCE" />}

      {/* ── End card ────────────────────────────────────────────────────────── */}
      {endOpacity > 0.01 && (
        <AbsoluteFill style={{ opacity: endOpacity, zIndex: 20 }}>
          <EndFrame />
        </AbsoluteFill>
      )}

      {/* ── Audio ───────────────────────────────────────────────────────────── */}
      <Audio src={staticFile('audio/main-audio.wav')} />

    </AbsoluteFill>
  );
};
