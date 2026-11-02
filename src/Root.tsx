// One <Composition> per entry in episodes/registry.ts (the content repo fills that list in).
import React from 'react';
import {Composition} from 'remotion';
import {compositions} from './toon/episodes/registry';

export const Root: React.FC = () => (
  <>
    {compositions.map((c) => (
      <Composition key={c.id} id={c.id} component={c.component} width={c.width} height={c.height} fps={c.fps}
        durationInFrames={c.durationInFrames} defaultProps={c.defaultProps} />
    ))}
  </>
);
