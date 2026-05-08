export type CardColor = "primary" | "secondary"

export interface CardItem {
  id: string
  title: string
  description?: string
  image?: string
  color: CardColor
}

export const cardStyles: Record<CardColor, string> = {
  primary: "bg-primary text-primary-foreground border-primary/20",
  secondary: "bg-secondary text-secondary-foreground border-secondary/20",
}