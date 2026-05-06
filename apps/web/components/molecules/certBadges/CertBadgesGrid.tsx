'use client';

import type { CertBadgeGridProps } from './certBadgesProps';
import { CertBadge } from '../../atoms/certBadge/certBadge';

export function CertBadgeGrid({
  badges,
  columns = 4,
  className = ''
}: CertBadgeGridProps) {
  return (
    <div
      className={`grid gap-6 justify-items-center mx-auto mb-6  ${className}`}
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