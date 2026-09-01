import { describe, expect, it } from "vitest"

import { groupCertifications } from "./certifications"

describe("groupCertifications", () => {
  it("groups issuers and sorts groups by their display label", () => {
    const certifications = [
      { issuer: "Microsoft", code: "AZ-900" },
      { issuer: "Amazon Web Services", code: "CLF-C02" },
      { issuer: "Amazon Web Services", code: "AIF-C01" },
      { issuer: "Microsoft", code: "AI-901" },
    ]

    const groups = groupCertifications(certifications)

    expect(groups.map((group) => group.label)).toEqual(["AWS", "Microsoft"])
    expect(groups[0]?.certifications.map((cert) => cert.code)).toEqual([
      "CLF-C02",
      "AIF-C01",
    ])
    expect(groups[1]?.certifications.map((cert) => cert.code)).toEqual([
      "AZ-900",
      "AI-901",
    ])
  })

  it("provides local official logo paths for known issuers", () => {
    const groups = groupCertifications([
      { issuer: "Amazon Web Services" },
      { issuer: "Microsoft" },
    ])

    expect(groups.map((group) => group.logoSrc)).toEqual([
      "/images/issuers/aws.svg",
      "/images/issuers/microsoft.svg",
    ])
  })

  it("keeps an unknown future issuer usable without a logo", () => {
    const [group] = groupCertifications([{ issuer: "Oracle", code: "OCI" }])

    expect(group).toMatchObject({
      issuer: "Oracle",
      label: "Oracle",
      logoSrc: undefined,
    })
  })
})
