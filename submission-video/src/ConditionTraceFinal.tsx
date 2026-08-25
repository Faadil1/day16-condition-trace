import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from 'remotion';

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;
export const DURATION = 1155; // 38.5s

const bg = '#132724';
const bg2 = '#0e1f1c';
const bronze = '#b78455';
const patina = '#3f5b53';
const paper = '#f0e4cf';
const stone = '#708b94';

const clip = (name: string) => staticFile(`v3-final-source/${name}`);

const Letterbox: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
  <AbsoluteFill style={{ backgroundColor: color ?? bg, color: paper, fontFamily: 'Georgia, "Times New Roman", serif' }}>
    {children}
  </AbsoluteFill>
);

// -- shared: thin bronze provenance/trace line ---------------------------
const TraceLine: React.FC<{ progress: number; y?: number }> = ({ progress, y = HEIGHT / 2 }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: y,
      height: 1,
      width: WIDTH * progress,
      background: `linear-gradient(90deg, transparent, ${bronze}, ${bronze})`,
      boxShadow: `0 0 8px ${bronze}`,
      opacity: 0.9,
    }}
  />
);

// -- 00:00-02.5s TITLE (frames 0-74) --------------------------------------
const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineProgress = interpolate(frame, [4, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dayOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleSpring = spring({ frame: frame - 12, fps, config: { damping: 200, mass: 0.6 } });
  const titleOpacity = interpolate(frame, [12, 26, 62, 74], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const taglineOpacity = interpolate(frame, [30, 42, 62, 74], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <Letterbox color={bg2}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 42%, rgba(183,132,85,0.14), transparent 45%)` }} />
      <TraceLine progress={lineProgress} y={HEIGHT / 2 + 46} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: HEIGHT / 2 - 150, textAlign: 'center' }}>
        <div style={{ opacity: dayOpacity, letterSpacing: '0.5em', color: bronze, fontSize: 17 }}>DAY 16</div>
        <div
          style={{
            marginTop: 22,
            opacity: titleOpacity,
            transform: `translateY(${(1 - titleSpring) * 14}px)`,
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: '0.06em',
          }}
        >
          CONDITION TRACE
        </div>
        <div style={{ marginTop: 26, opacity: taglineOpacity, fontSize: 20, letterSpacing: '0.22em', color: stone }}>
          TRACE THE RECORD.<br />NOT THE BLAME.
        </div>
      </div>
    </Letterbox>
  );
};

// -- annotation margin: a strip OUTSIDE the product frame, never on top of UI --
const MARGIN = 74;
const BOTTOM_MARGIN = 54;

const RegistrationLabel: React.FC<{ text: string; sub?: string; opacity: number; align?: 'left' | 'right' }> = ({
  text,
  sub,
  opacity,
  align = 'left',
}) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      height: MARGIN,
      [align]: 76,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: align,
      alignItems: align === 'right' ? 'flex-end' : 'flex-start',
      opacity,
      letterSpacing: '0.22em',
      color: bronze,
      fontSize: 15,
      fontFamily: 'Georgia, serif',
    }}
  >
    {text}
    {sub && <div style={{ color: paper, opacity: 0.7, fontSize: 12, marginTop: 3, letterSpacing: '0.12em' }}>{sub}</div>}
  </div>
);

// video is inset below a top annotation margin so overlay text never sits on
// top of real application UI -- it lives in the negative space around it
const VideoFrame: React.FC<{
  children?: React.ReactNode;
  overlayTop?: React.ReactNode;
  overlayBottom?: React.ReactNode;
  gradient?: boolean;
  margin?: boolean;
}> = ({ children, overlayTop, overlayBottom, gradient = true, margin = true }) => (
  <AbsoluteFill style={{ backgroundColor: bg2 }}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: margin ? MARGIN : 0,
        bottom: margin ? BOTTOM_MARGIN : 0,
        overflow: 'hidden',
      }}
    >
      {children}
      {gradient && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(14,31,28,0.22) 0%, rgba(14,31,28,0) 10%, rgba(14,31,28,0) 88%, rgba(14,31,28,0.34) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
    {margin && (
      <>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: MARGIN, background: bg2, borderBottom: '1px solid rgba(183,132,85,0.18)' }}>
          {overlayTop}
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: BOTTOM_MARGIN, background: bg2, borderTop: '1px solid rgba(183,132,85,0.14)' }}>
          {overlayBottom}
        </div>
      </>
    )}
  </AbsoluteFill>
);

const BottomNote: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => (
  <div
    style={{
      position: 'absolute',
      left: 76,
      bottom: 0,
      height: BOTTOM_MARGIN,
      display: 'flex',
      alignItems: 'center',
      opacity,
      letterSpacing: '0.14em',
      color: paper,
      fontSize: 12.5,
      maxWidth: WIDTH - 152,
      fontFamily: 'Georgia, serif',
    }}
  >
    {text}
  </div>
);

// -- 02.5-06s OPEN ---------------------------------------------------------
const OpenScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1, 1.028], { extrapolateRight: 'clamp' });
  const labelOpacity = interpolate(frame, [10, 26, duration - 14, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <VideoFrame overlayTop={<RegistrationLabel text="CT-1847" sub="RETURN EXAMINATION" opacity={labelOpacity} align="right" />}>
      <div style={{ width: '100%', height: '100%', transform: `scale(${scale})`, transformOrigin: '58% 50%' }}>
        <OffthreadVideo src={clip('01-open.mp4')} startFrom={0} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </VideoFrame>
  );
};

// -- 06-10s RECORDS ---------------------------------------------------------
const RecordsScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const dates = ['14 JUL', '16 JUL', '01 AUG', '03 AUG'];
  const lineProgress = interpolate(frame, [4, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const railOpacity = interpolate(frame, [0, 12, duration - 18, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const overlayTop = (
    <div style={{ position: 'absolute', left: 76, top: 0, height: MARGIN, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: railOpacity }}>
      <div style={{ letterSpacing: '0.2em', color: bronze, fontSize: 13 }}>TRACE THE DOCUMENTATION</div>
      <div style={{ display: 'flex', gap: 26, marginTop: 8 }}>
        {dates.map((d, i) => {
          const appear = interpolate(frame, [6 + i * 6, 16 + i * 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <span key={d} style={{ opacity: appear, color: paper, fontSize: 12, letterSpacing: '0.14em' }}>
              {d}
            </span>
          );
        })}
      </div>
    </div>
  );
  const overlayBottom = (
    <div
      style={{
        position: 'absolute',
        left: 76,
        top: '50%',
        width: 240,
        height: 1,
        background: bronze,
        opacity: railOpacity * 0.5,
        transform: `scaleX(${lineProgress})`,
        transformOrigin: 'left',
      }}
    />
  );
  return (
    <VideoFrame overlayTop={overlayTop} overlayBottom={overlayBottom}>
      <OffthreadVideo src={clip('02-records.mp4')} startFrom={0} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </VideoFrame>
  );
};

// -- 10-18s RAKING LIGHT (hero) ---------------------------------------------
const RakingLightScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1.01, 1.05], { extrapolateRight: 'clamp' });
  // synchronized with the real inspect clip: angle steps down from ~24deg to 8deg (capture ready)
  const angleSteps = [24, 16, 14, 12, 10, 8];
  const stepFrames = duration / angleSteps.length;
  const stepIndex = Math.min(angleSteps.length - 1, Math.floor(frame / stepFrames));
  const angle = angleSteps[stepIndex];
  const labelOpacity = interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bandX = interpolate(frame, [0, duration], [-8, 108], { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) });
  const readyPulse = frame > duration - 34 ? interpolate(frame, [duration - 34, duration - 20, duration], [0, 1, 1], { extrapolateRight: 'clamp' }) : 0;
  const overlayTop = (
    <>
      <div style={{ position: 'absolute', left: 76, top: 0, height: MARGIN, display: 'flex', alignItems: 'center', opacity: labelOpacity * 0.9, letterSpacing: '0.2em', color: bronze, fontSize: 13 }}>
        CHANGE THE EXAMINATION CONDITION
      </div>
      <RegistrationLabel text="GRAZING ANGLE" sub={`${angle}° FROM SURFACE`} opacity={labelOpacity} align="right" />
    </>
  );
  const overlayBottom = readyPulse > 0 ? (
    <div style={{ position: 'absolute', left: 76, top: 0, height: BOTTOM_MARGIN, display: 'flex', alignItems: 'center', opacity: readyPulse, letterSpacing: '0.2em', color: bronze, fontSize: 13 }}>
      CAPTURE READY
    </div>
  ) : undefined;
  return (
    <VideoFrame overlayTop={overlayTop} overlayBottom={overlayBottom}>
      <div style={{ width: '100%', height: '100%', transform: `scale(${scale})`, transformOrigin: '62% 46%' }}>
        <OffthreadVideo src={clip('03-inspect.mp4')} startFrom={0} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${bandX}%`,
          width: 90,
          background: 'linear-gradient(90deg, transparent, rgba(240,228,207,0.05), transparent)',
          pointerEvents: 'none',
        }}
      />
    </VideoFrame>
  );
};

// -- 18-21s OBS-04 -----------------------------------------------------------
const Obs04Scene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  // real transient is ~1s; time-remap (slow to 1/3 speed) to fill the 3s editorial beat
  const playbackRate = 1 / 3;
  const line1 = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const line2 = interpolate(frame, [16, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const line3 = interpolate(frame, [28, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [duration - 14, duration], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const overlayTop = (
    <div style={{ position: 'absolute', left: 76, top: 0, height: MARGIN, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ opacity: line1 * fadeOut, letterSpacing: '0.24em', color: bronze, fontSize: 15 }}>OBS-04</div>
      <div style={{ opacity: line2 * fadeOut, letterSpacing: '0.2em', color: paper, fontSize: 12, marginTop: 3 }}>FRAME PRESERVED</div>
      <div style={{ opacity: line3 * fadeOut, letterSpacing: '0.2em', color: stone, fontSize: 11, marginTop: 2 }}>HUMAN REVIEWED</div>
    </div>
  );
  return (
    <VideoFrame overlayTop={overlayTop}>
      <OffthreadVideo src={clip('04-obs04.mp4')} startFrom={0} playbackRate={playbackRate} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </VideoFrame>
  );
};

// -- 21-26s COMPARE -----------------------------------------------------------
const CompareScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const labelOpacity = interpolate(frame, [8, 22, duration - 16, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const focus = interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) });
  const overlayTop = (
    <div style={{ position: 'absolute', left: 76, top: 0, height: MARGIN, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ opacity: labelOpacity, letterSpacing: '0.2em', color: bronze, fontSize: 13 }}>COMPARE LIKE WITH LIKE</div>
      <div style={{ opacity: labelOpacity * 0.85, letterSpacing: '0.14em', color: paper, fontSize: 11, marginTop: 4 }}>
        AREA MATCH &middot; LIGHTING GAP &middot; NO EQUIVALENT RAKING-LIGHT CAPTURE
      </div>
    </div>
  );
  const overlayBottom = (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: `${18 + focus * 46}%`,
        width: 8,
        height: 8,
        marginTop: -4,
        borderRadius: '50%',
        background: bronze,
        opacity: 0.7,
        boxShadow: `0 0 10px ${bronze}`,
      }}
    />
  );
  return (
    <VideoFrame overlayTop={overlayTop} overlayBottom={overlayBottom}>
      <OffthreadVideo src={clip('05-compare.mp4')} startFrom={0} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </VideoFrame>
  );
};

// -- 26-32s EVIDENCE TRACE / FINDING ------------------------------------------
const nodes = ['SRC-03', 'OBS-04', 'CMP-01', 'LIM-01', 'FND-01'];
const EvidenceTraceScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const perNode = 20;
  const findingOpacity = interpolate(frame, [duration - 60, duration - 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const overlayTop = (
    <div style={{ position: 'absolute', right: 76, top: 0, height: MARGIN, display: 'flex', alignItems: 'center', gap: 16 }}>
      {nodes.map((n, i) => {
        const start = 6 + i * perNode;
        const pulse = spring({ frame: frame - start, fps, config: { damping: 14, mass: 0.4 } });
        const opacity = interpolate(frame, [start, start + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <div
            key={n}
            style={{
              opacity,
              transform: `scale(${0.94 + pulse * 0.06})`,
              letterSpacing: '0.16em',
              color: bronze,
              fontSize: 13,
              textShadow: pulse > 0.4 && pulse < 0.9 ? `0 0 10px ${bronze}` : 'none',
            }}
          >
            {n}
          </div>
        );
      })}
    </div>
  );
  const overlayBottom = (
    <div style={{ position: 'absolute', left: 76, top: 0, height: BOTTOM_MARGIN, display: 'flex', alignItems: 'center', opacity: findingOpacity, letterSpacing: '0.12em', color: paper, fontSize: 12, maxWidth: 700 }}>
      Prior physical absence cannot be confirmed.
    </div>
  );
  return (
    <VideoFrame overlayTop={overlayTop} overlayBottom={overlayBottom}>
      <OffthreadVideo src={clip('06-finding.mp4')} startFrom={0} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </VideoFrame>
  );
};

// -- 32-36s EVIDENCE RECORD ------------------------------------------------
const RecordScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1, 1.03], { extrapolateRight: 'clamp' });
  const labelOpacity = interpolate(frame, [6, 18, duration - 10, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <VideoFrame
      gradient={false}
      overlayTop={<RegistrationLabel text="CT-1847 / 03 AUG 2026" sub="NO DETERMINATION OF CAUSE OR LIABILITY" opacity={labelOpacity} align="left" />}
    >
      <div style={{ width: '100%', height: '100%', transform: `scale(${scale})`, transformOrigin: '50% 42%' }}>
        <OffthreadVideo src={clip('07-record.mp4')} startFrom={0} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </VideoFrame>
  );
};

// -- 36-38.5s END CARD -------------------------------------------------------
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 14, 58, 75], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lineProgress = interpolate(frame, [10, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Letterbox color={bg2}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 42%, rgba(183,132,85,0.12), transparent 45%)` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: HEIGHT / 2 - 110, textAlign: 'center', opacity }}>
        <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: '0.06em' }}>CONDITION TRACE</div>
        <div style={{ marginTop: 20, fontSize: 18, letterSpacing: '0.22em', color: bronze }}>TRACE THE RECORD. NOT THE BLAME.</div>
        <div style={{ marginTop: 34, fontSize: 15, letterSpacing: '0.2em', color: stone }}>DAY 16 &middot; 30 DAYS OF REAL BUSINESS PROBLEMS</div>
      </div>
      <TraceLine progress={lineProgress} y={HEIGHT / 2 + 90} />
    </Letterbox>
  );
};

export const ConditionTraceDay16Final: React.FC = () => {
  const OPEN_D = 105;
  const RECORDS_D = 120;
  const RAKING_D = 240;
  const OBS04_D = 90;
  const COMPARE_D = 150;
  const FINDING_D = 180;
  const RECORD_D = 120;
  const END_D = 75;
  const TITLE_D = 75;

  let cursor = TITLE_D;
  const openFrom = cursor; cursor += OPEN_D;
  const recordsFrom = cursor; cursor += RECORDS_D;
  const rakingFrom = cursor; cursor += RAKING_D;
  const obsFrom = cursor; cursor += OBS04_D;
  const compareFrom = cursor; cursor += COMPARE_D;
  const findingFrom = cursor; cursor += FINDING_D;
  const recordFrom = cursor; cursor += RECORD_D;
  const endFrom = cursor; cursor += END_D;

  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <Sequence from={0} durationInFrames={TITLE_D}><Title /></Sequence>
      <Sequence from={openFrom} durationInFrames={OPEN_D}><OpenScene duration={OPEN_D} /></Sequence>
      <Sequence from={recordsFrom} durationInFrames={RECORDS_D}><RecordsScene duration={RECORDS_D} /></Sequence>
      <Sequence from={rakingFrom} durationInFrames={RAKING_D}><RakingLightScene duration={RAKING_D} /></Sequence>
      <Sequence from={obsFrom} durationInFrames={OBS04_D}><Obs04Scene duration={OBS04_D} /></Sequence>
      <Sequence from={compareFrom} durationInFrames={COMPARE_D}><CompareScene duration={COMPARE_D} /></Sequence>
      <Sequence from={findingFrom} durationInFrames={FINDING_D}><EvidenceTraceScene duration={FINDING_D} /></Sequence>
      <Sequence from={recordFrom} durationInFrames={RECORD_D}><RecordScene duration={RECORD_D} /></Sequence>
      <Sequence from={endFrom} durationInFrames={END_D}><EndCard /></Sequence>
    </AbsoluteFill>
  );
};
