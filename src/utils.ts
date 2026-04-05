import type { ProfileType } from './types';

export function profileGradient(type: ProfileType): string {
  return type === 'teen'
    ? 'linear-gradient(135deg, #5ec2ff 0%, #2c77f4 100%)'
    : 'linear-gradient(135deg, #ffb24a 0%, #ff6f61 100%)';
}

export function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.ceil((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

export function shortToothLabel(label: string): string {
  return label
    .replace('Top ', 'T ')
    .replace('Bottom ', 'B ')
    .replace('right', 'R')
    .replace('left', 'L')
    .replace('middle', 'Mid')
    .replace('front', 'Front')
    .replace('back', 'Back');
}
