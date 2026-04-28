import type { VariantProps } from "class-variance-authority"
import type { buttonVariants } from "@arthurreira/ui/components/button"

export type HeroButtonProps = {
  href: string
  label: string
} & VariantProps<typeof buttonVariants>