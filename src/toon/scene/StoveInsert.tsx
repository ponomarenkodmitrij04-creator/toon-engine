// Close-up of the gas hob in the blackout (fits the 9:16 slice centred on x = 960, i.e. 656..1264).
// Your hand reaches for a knob, stops on "Don't" and pulls back. Beats (seconds): reach, stop.
import React from 'react';
import {INK, OW, HERO} from '../rig/style';
import {clamp, easeInOut, easeOut, kick, mixP, ramp, wobble} from '../lib/anim';

type Beats = {reach: number; stop: number};
const st = {stroke: INK, strokeWidth: OW, strokeLinejoin: 'round' as const};
export const KNOB = {x: 1040, y: 752};

const Burner: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
  <g>
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.3} fill="#2b2f3f" {...st} />
    <ellipse cx={x} cy={y - 4} rx={r * 0.55} ry={r * 0.17} fill="#5a6072" stroke={INK} strokeWidth={4} />
    <ellipse cx={x} cy={y - 8} rx={r * 0.32} ry={r * 0.1} fill="#3a3f52" stroke={INK} strokeWidth={3} />
    {[-1, 1].map((s) => <path key={s} d={`M ${x + s * r * 1.05} ${y - 2} L ${x + s * r * 0.2} ${y - 6}`} stroke="#1a1d29" strokeWidth={9} strokeLinecap="round" />)}
    <path d={`M ${x} ${y - r * 0.32} L ${x} ${y - r * 0.06} M ${x} ${y + r * 0.08} L ${x} ${y + r * 0.32}`} stroke="#1a1d29" strokeWidth={9} strokeLinecap="round" />
  </g>
);

const Knob: React.FC<{x: number; y: number; ang: number}> = ({x, y, ang}) => (
  <g>
    <circle cx={x} cy={y + 4} r={30} fill="#000" opacity={0.2} />
    <circle cx={x} cy={y} r={30} fill="#d9dde4" {...st} />
    <circle cx={x} cy={y} r={20} fill="#eef1f5" stroke={INK} strokeWidth={3} />
    <rect x={x - 7} y={y - 28} width={14} height={56} rx={6} fill="#b8bec8" stroke={INK} strokeWidth={3} transform={`rotate(${ang} ${x} ${y})`} />
  </g>
);

export const StoveInsert: React.FC<{f: number; fps: number; t0: number; beats: Beats}> = ({f, fps, t0, beats}) => {
  const t = f / fps, lt = t - t0;
  const push = 1.02 + lt * 0.012;
  const jolt = kick(f, beats.stop * fps, fps, 6, 6);
  const camX = wobble(t * 0.7, 5) * 4 + jolt * 8, camY = wobble(t * 0.5, 2) * 4;

  // the hand slides in slowly, fingers almost on the knob, then snaps back on "Don't"
  const OFF = {x: 1400, y: 1460};
  const near = {x: KNOB.x + 46, y: KNOB.y + 40};
  const inK = easeInOut(clamp((t - beats.reach) / Math.max(0.6, beats.stop - beats.reach - 0.1)));
  const back = ramp(t, beats.stop + 0.05, beats.stop + 0.45, easeOut);
  const hand = mixP(mixP(OFF, near, inK * 0.97), {x: 1330, y: 1400}, back);
  const sleeve = {x: hand.x + 420, y: hand.y + 620};

  return (
    <g transform={`translate(${960 + camX} ${540 + camY}) scale(${push}) translate(-960 -770)`}>
      {/* tiled wall */}
      <rect x={-200} y={-400} width={2400} height={920} fill="#e6ece8" />
      {Array.from({length: 26}, (_, i) => <line key={'v' + i} x1={-200 + i * 90} y1={-400} x2={-200 + i * 90} y2={520} stroke="#c9d4ce" strokeWidth={4} />)}
      {Array.from({length: 8}, (_, i) => <line key={'h' + i} x1={-200} y1={-160 + i * 90} x2={2200} y2={-160 + i * 90} stroke="#c9d4ce" strokeWidth={4} />)}
      {/* hood above */}
      <path d="M 700 -40 L 1220 -40 L 1290 170 L 630 170 Z" fill="#c7ccd4" {...st} />
      <rect x={620} y={168} width={680} height={30} rx={6} fill="#aab1bc" {...st} />
      {/* counter + hob top surface */}
      <rect x={-200} y={520} width={2400} height={40} fill="#e3dccf" {...st} />
      <path d="M 700 540 L 1220 540 L 1290 712 L 630 712 Z" fill="#3a3f52" {...st} />
      <path d="M 720 552 L 1200 552" stroke="#5a6072" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      <Burner x={840} y={580} r={78} />
      <Burner x={1080} y={580} r={70} />
      <Burner x={812} y={660} r={96} />
      <Burner x={1110} y={660} r={88} />
      {/* front panel with knobs, cabinets below */}
      <rect x={-200} y={712} width={2400} height={90} fill="#eef0f2" {...st} />
      {[740, 880, KNOB.x, 1180].map((x) => <Knob key={x} x={x} y={KNOB.y} ang={0} />)}
      <rect x={-200} y={802} width={2400} height={800} fill="#6f9789" {...st} />
      {[660, 960, 1260].map((x) => (
        <g key={x}>
          <line x1={x} y1={802} x2={x} y2={1500} stroke={INK} strokeWidth={OW} />
          <rect x={x - 30} y={840} width={12} height={60} rx={5} fill="#e9e4dc" stroke={INK} strokeWidth={3} />
          <rect x={x + 18} y={840} width={12} height={60} rx={5} fill="#e9e4dc" stroke={INK} strokeWidth={3} />
        </g>
      ))}

      {/* forearm + reaching hand (index finger forward) */}
      <path d={`M ${hand.x + 40} ${hand.y + 40} L ${sleeve.x} ${sleeve.y}`} stroke={INK} strokeWidth={96 + OW * 2} strokeLinecap="round" />
      <path d={`M ${hand.x + 40} ${hand.y + 40} L ${sleeve.x} ${sleeve.y}`} stroke={HERO.topLight} strokeWidth={96} strokeLinecap="round" />
      <path d={`M ${hand.x + 52} ${hand.y + 56} L ${hand.x + 78} ${hand.y + 90}`} stroke={HERO.cuff} strokeWidth={90} strokeLinecap="round" />
      <g transform={`translate(${hand.x} ${hand.y}) rotate(-128)`}>
        <ellipse cx={-6} cy={0} rx={46} ry={34} fill={HERO.skin.light} {...st} />
        <rect x={20} y={-26} width={62} height={20} rx={10} fill={HERO.skin.base} {...st} />
        {[0, 1, 2].map((i) => <rect key={i} x={14} y={-6 + i * 15} width={34} height={18} rx={9} fill={HERO.skin.base} {...st} />)}
        <ellipse cx={-2} cy={30} rx={22} ry={12} fill={HERO.skin.base} {...st} />
      </g>
    </g>
  );
};
