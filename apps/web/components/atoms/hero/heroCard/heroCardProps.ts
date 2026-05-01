export interface HeroCardProps {
  title: string
  description: string
  icon: "mapPin" | "briefcase" | "rocket"
  href?: string
  weather?: {
    city: string
    temperature: number
    emoji: string
    description: string
  }
}
