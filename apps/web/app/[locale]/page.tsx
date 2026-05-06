import { Hero } from "@/components/organisms"
import { CertBadgeGrid, CertBadgeProps } from "@/components/molecules/certBadges/"

export default function Page() {

  const badges: CertBadgeProps[] = [
    {
      tone: 'muted',
      label: 'AWS Cloud Practitioner',
      sub: 'CLF-C02 2026–2029',
      imgSrc: '/images/aws-certified-cloud-practitioner.png',
    },
    {
      tone: 'muted',
      label: 'Azure Fundamentals',
      sub: 'AZ-900',
      glyph: 'AZ',
      imgSrc: '/images/microsoft-certified-fundamentals.svg',

    },
  ];
  return (

    <div className="min-h-screen flex flex-col items-center justify-center gap-8 md:gap-12 lg:gap-8 py-8 md:py-6 lg:py-6 ">
      <Hero />
      <CertBadgeGrid columns={2} badges={badges} />
    </div>
  )
}
