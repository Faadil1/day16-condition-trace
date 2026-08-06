import React from 'react';
import { Composition } from 'remotion';
import { ConditionTraceFinal, COMP_WIDTH, COMP_HEIGHT, COMP_FPS, COMP_FRAMES } from './ConditionTraceFinal';
import { CoverPortrait } from './CoverPortrait';
import { CoverSquare } from './CoverSquare';
import { ContactSheet } from './ContactSheet';

export const Root: React.FC = () => (
  <>
    <Composition
      id="ConditionTraceFinal"
      component={ConditionTraceFinal}
      durationInFrames={COMP_FRAMES}
      fps={COMP_FPS}
      width={COMP_WIDTH}
      height={COMP_HEIGHT}
    />
    <Composition
      id="CoverPortrait"
      component={CoverPortrait}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={1350}
    />
    <Composition
      id="CoverSquare"
      component={CoverSquare}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={1080}
    />
    <Composition
      id="ContactSheet"
      component={ContactSheet}
      durationInFrames={1}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
