// Public stub. The private content repo overwrites this file with the real list of episodes.
import type React from 'react';

export type EpisodeComp = {
  id: string;
  component: React.ComponentType<any>;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  defaultProps?: Record<string, unknown>;
};

export const compositions: EpisodeComp[] = [];
