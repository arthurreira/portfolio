interface CertificationLike {
  issuer: string
}

const ISSUER_META: Record<
  string,
  { label: string; logoSrc: string; logoAlt: string }
> = {
  "Amazon Web Services": {
    label: "AWS",
    logoSrc: "/images/issuers/aws.svg",
    logoAlt: "Amazon Web Services",
  },
  Microsoft: {
    label: "Microsoft",
    logoSrc: "/images/issuers/microsoft.svg",
    logoAlt: "Microsoft",
  },
}

export function groupCertifications<T extends CertificationLike>(
  certifications: T[]
) {
  const grouped = new Map<string, T[]>()

  for (const certification of certifications) {
    const group = grouped.get(certification.issuer) ?? []
    group.push(certification)
    grouped.set(certification.issuer, group)
  }

  return [...grouped.entries()]
    .map(([issuer, entries]) => {
      const meta = ISSUER_META[issuer]

      return {
        issuer,
        label: meta?.label ?? issuer,
        logoSrc: meta?.logoSrc,
        logoAlt: meta?.logoAlt,
        certifications: entries,
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label))
}
