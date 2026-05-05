export type BadgeTone =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'success';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface CertBadgeProps {
  tone: BadgeTone;
  size?: BadgeSize;
  label: string;
  sub: string;
  glyph?: string;
  imgSrc?: string;
  onActivate?: () => void;
}


export const SIZES: Record<BadgeSize, {
  svg: number;
  glyph: number;
  label: string;
  sub: string;
  gap: number;
}> = {
  sm: { svg: 40, glyph: 16, label: 'text-xs', sub: 'text-[10px]', gap: 4 },
  md: { svg: 56, glyph: 22, label: 'text-sm', sub: 'text-xs', gap: 6 },
  lg: { svg: 72, glyph: 28, label: 'text-base', sub: 'text-sm', gap: 8 },
};