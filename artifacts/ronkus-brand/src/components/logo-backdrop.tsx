import type { CSSProperties } from 'react';

type LogoDensity = 'low' | 'medium' | 'high';

type LogoPosition = {
  top: string;
  left?: string;
  right?: string;
  width: number;
  rotation: number;
};

const logoPositions: LogoPosition[] = [
  { top: '9%', left: '1%', width: 220, rotation: -12 },
  { top: '22%', right: '2%', width: 300, rotation: 8 },
  { top: '38%', left: '6%', width: 180, rotation: -5 },
  { top: '53%', right: '8%', width: 340, rotation: 11 },
  { top: '68%', left: '2%', width: 260, rotation: -14 },
  { top: '82%', right: '3%', width: 200, rotation: 4 },
  { top: '93%', left: '12%', width: 320, rotation: -8 },
  { top: '98%', right: '16%', width: 240, rotation: 12 },
];

const densityCount: Record<LogoDensity, number> = {
  low: 6,
  medium: 7,
  high: 8,
};

export function LogoBackdrop({ density }: { density: LogoDensity }) {
  return (
    <div className={`logo-backdrop logo-backdrop-${density}`} aria-hidden="true">
      {logoPositions.slice(0, densityCount[density]).map((position, index) => {
        const style: CSSProperties & {
          '--logo-width': string;
          '--logo-rotation': string;
        } = {
          top: position.top,
          left: position.left,
          right: position.right,
          '--logo-width': `${position.width}px`,
          '--logo-rotation': `${position.rotation}deg`,
        };
        return (
          <span
            className={`logo-backdrop-mark ${position.left ? 'logo-backdrop-mark-left' : 'logo-backdrop-mark-right'}`}
            key={index}
            style={style}
          />
        );
      })}
    </div>
  );
}
