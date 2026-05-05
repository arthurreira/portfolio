import { Hero } from "@/components/organisms"
import { CertBadgeGrid } from "@/components/molecules/certBadges/"
import { Footer } from "@/components/organisms/Footer/Footer";

export default function Page() {

const badges = [
  {
    tone: 'primary',
    label: 'AWS Cloud Practitioner',
    sub: 'CLF-C02 2026–2029',
    imgSrc: '/images/aws-certified-cloud-practitioner.png',
  },
  {
    tone: 'primary',
    label: 'Azure Fundamentals',
    sub: 'AZ-900',
    glyph: 'AZ',
    imgSrc: '/images/microsoft-certified-fundamentals.svg',

  },
];
  return (

    <div className="min-h-screen flex flex-col space-y-16">
      <Hero />
      <CertBadgeGrid columns={2} badges={badges} />
      <Footer />
    </div>
  )
}
