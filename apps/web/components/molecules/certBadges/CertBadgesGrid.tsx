'use client';

import type { CertBadgeGridProps } from './certBadgesProps';
import { CertBadge } from '../../atoms/certBadge/certBadge';

export function CertBadgeGrid({
  badges,
  columns = 4,
  className = ''
}: CertBadgeGridProps) {
  console.log('badges:', badges);
  return (
    <div
      className={`grid gap-6 justify-items-center mx-auto   ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {badges.map((b) => (
        <CertBadge key={b.label} {...b} />
      ))}
    </div>
  );
}