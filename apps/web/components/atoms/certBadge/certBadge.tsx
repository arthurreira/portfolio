'use client';
import { useState } from 'react';
import type { CertBadgeProps, BadgeTone } from './certBadgeProps';
import { SIZES } from './certBadgeProps';

export const TONES: Record<BadgeTone, {
  ring: string;
  fill: string;
  glow: string;
  accent: string;
  sub: string;
}> = {
  primary: {
    ring: 'var(--primary)',
    fill: 'color-mix(in oklch, var(--primary) 12%, transparent)',
    glow: 'color-mix(in oklch, var(--primary) 35%, transparent)',
    accent: 'var(--primary)',
    sub: 'color-mix(in oklch, var(--primary) 55%, var(--muted-foreground))',
  },
  secondary: {
    ring: 'var(--secondary)',
    fill: 'color-mix(in oklch, var(--secondary) 12%, transparent)',
    glow: 'color-mix(in oklch, var(--secondary) 25%, transparent)',
    accent: 'var(--secondary)',
    sub: 'color-mix(in oklch, var(--secondary) 55%, var(--muted-foreground))',
  },
  accent: {
    ring: 'var(--accent)',
    fill: 'color-mix(in oklch, var(--accent) 12%, transparent)',
    glow: 'color-mix(in oklch, var(--accent) 30%, transparent)',
    accent: 'var(--accent)',
    sub: 'color-mix(in oklch, var(--accent) 55%, var(--muted-foreground))',
  },
  muted: {
    ring: 'var(--muted-foreground)',
    fill: 'color-mix(in oklch, var(--muted) 40%, transparent)',
    glow: 'transparent',
    accent: 'var(--muted-foreground)',
    sub: 'var(--muted-foreground)',
  },
  success: {
    ring: 'oklch(0.72 0.18 145)',
    fill: 'color-mix(in oklch, oklch(0.72 0.18 145) 12%, transparent)',
    glow: 'color-mix(in oklch, oklch(0.72 0.18 145) 35%, transparent)',
    accent: 'oklch(0.72 0.18 145)',
    sub: 'color-mix(in oklch, oklch(0.72 0.18 145) 55%, var(--muted-foreground))',
  },
};

export function CertBadge({ tone, label, sub, glyph, imgSrc, onActivate, size }: CertBadgeProps) {
  const [hot, setHot] = useState(false);
  const [pop, setPop] = useState(false);
  const [pressed, setPressed] = useState(false);
  const c = TONES[tone];
  const s = SIZES[size ?? 'lg'];

  const activate = () => {
    setPop(true);
    setTimeout(() => setPop(false), 600);
    onActivate?.();
  };

  const transform = pressed
    ? 'scale(0.96)'
    : hot
    ? 'translateY(-4px)'
    : 'translateY(0)';

  return (
    <button
      type="button"
      aria-label={`${label} – ${sub}`}
      onClick={activate}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        background: 'transparent',
        border: 0,
        padding: 0,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: s.gap,
        minWidth: s.svg + 20,
        outline: hot ? `2px solid ${c.accent}` : 'none',
        outlineOffset: '4px',
        transform,
        transition: 'all .2s ease',
        fontFamily: 'var(--font-mono, ui-monospace, monospace)',
      }}
    >
      <div style={{ filter: `drop-shadow(0 0 ${hot || pop ? 16 : 4}px ${c.glow})`, transition: 'filter .2s ease' }}>
        <svg role="img" aria-label={label} viewBox="0 0 100 100" width={s.svg} height={s.svg}>
          <title>{label}</title>
          <polygon
            points="50,4 92,28 92,72 50,96 8,72 8,28"
            fill={c.fill}
            stroke={c.ring}
            strokeWidth={hot ? 3 : 2}
          />
          {imgSrc
            ? <image href={imgSrc} x="22" y="22" width="56" height="56" preserveAspectRatio="xMidYMid meet" />
            : <text x="50" y="58" textAnchor="middle" fill={c.accent}
                fontFamily="ui-monospace, monospace" fontWeight="700" fontSize={s.glyph}>{glyph}</text>}
          {pop && (
            <circle cx="50" cy="50" r="46" fill="none" stroke={c.ring} strokeWidth="2">
              <animate attributeName="r" from="40" to="60" dur="0.6s" fill="freeze" />
              <animate attributeName="opacity" from="0.8" to="0" dur="0.6s" fill="freeze" />
            </circle>
          )}
        </svg>
      </div>
      <div style={{ textAlign: 'center', lineHeight: 1.15 }}>
        <div style={{
          fontSize: s.label,
          fontWeight: 600,
          letterSpacing: '0.12em',
          color: c.accent,
          textTransform: 'uppercase',
        }}>{label}</div>
        <div style={{
          fontSize: s.sub,
          color: c.sub,
          letterSpacing: '0.02em',
          marginTop: 1,
        }}>{sub}</div>
      </div>
    </button>
  );
}
