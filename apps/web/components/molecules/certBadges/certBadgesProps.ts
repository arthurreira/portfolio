import type { CertBadgeProps } from '../../atoms/certBadge/certBadgeProps';

export interface CertBadgeGridProps {
  badges: CertBadgeProps[];
  columns?: number; // optional layout control
  className?: string;
}