import React from 'react';
import { Composition } from 'remotion';
import { CanonicalV3Verification, DURATION, WIDTH, HEIGHT, FPS } from './ConditionTraceFinal';

export const Root: React.FC = () => (
  <Composition
    id="CanonicalV3Verification"
    component={CanonicalV3Verification}
    durationInFrames={DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
