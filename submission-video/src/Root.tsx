import React from 'react';
import { Composition } from 'remotion';
import { ConditionTraceDay16Final, DURATION, WIDTH, HEIGHT, FPS } from './ConditionTraceFinal';

export const Root: React.FC = () => (
  <Composition id="ConditionTraceDay16Final" component={ConditionTraceDay16Final} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
